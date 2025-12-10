import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Spinner, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Btn } from "components/button";
import { toastError, toastSuccess } from "components/toast/popUp";
import { MdMyLocation } from "react-icons/md";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number, locationName?: string) => void;
  initialLat?: number;
  initialLng?: number;
};

// Reverse geocoding funksiyasi
const getLocationName = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EMU Event Management System'
        }
      }
    );
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      // Location name'ni formatlash
      const parts = [];
      if (address.road) parts.push(address.road);
      if (address.house_number) parts.push(address.house_number);
      if (address.suburb) parts.push(address.suburb);
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village);
      }
      if (address.country) parts.push(address.country);
      
      return parts.length > 0 ? parts.join(', ') : data.display_name || null;
    }
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

function LocationMarker({ 
  onSelect, 
  initialLat, 
  initialLng,
  currentPosition 
}: { 
  onSelect: (lat: number, lng: number) => void; 
  initialLat?: number; 
  initialLng?: number;
  currentPosition?: [number, number] | null;
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([initialLat, initialLng]);
      map.setView([initialLat, initialLng], 15);
    } else if (!initialLat && !initialLng) {
      // Agar initialLat/initialLng yo'q bo'lsa, position'ni tozalaymiz
      setPosition(null);
    }
  }, [initialLat, initialLng, map]);

  useEffect(() => {
    if (currentPosition) {
      setPosition(currentPosition);
      map.setView(currentPosition, 15);
      // onSelect ni chaqirmaymiz, chunki bu handleMapClick ni trigger qiladi va loop yuzaga keladi
      // Faqat position'ni o'zgartiramiz va map'ni ko'rsatamiz
    }
  }, [currentPosition, map]);

  const handleDragEnd = (e: any) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);
    onSelect(lat, lng);
  };

  return position ? (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  ) : null;
}

export function MapPicker({ isOpen, onClose, onSelect, initialLat, initialLng }: Props) {
  const [selectedLat, setSelectedLat] = useState<number | undefined>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number | undefined>(initialLng);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Modal ochilganda yoki initialLat/initialLng o'zgarganda currentPosition ni tozalaymiz
    setCurrentPosition(null);
    
    if (initialLat && initialLng) {
      setSelectedLat(initialLat);
      setSelectedLng(initialLng);
      // Initial location uchun ham reverse geocoding qilamiz
      getLocationName(initialLat, initialLng).then((name) => {
        setLocationName(name);
      });
    } else {
      // Agar initialLat/initialLng yo'q bo'lsa, selectedLat/selectedLng ni ham tozalaymiz
      setSelectedLat(undefined);
      setSelectedLng(undefined);
      setLocationName(null);
    }
  }, [initialLat, initialLng]);

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setIsLoadingLocation(true);
    const name = await getLocationName(lat, lng);
    setLocationName(name);
    setIsLoadingLocation(false);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toastError("Геолокация не поддерживается вашим браузером");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setIsGettingLocation(false);
        toastSuccess("Местоположение определено!");
        
        // To'g'ridan-to'g'ri handleMapClick ni chaqiramiz (reverse geocoding bilan)
        await handleMapClick(latitude, longitude);
        
        // Map'ga o'tish uchun currentPosition'ni set qilamiz
        setCurrentPosition([latitude, longitude]);
      },
      (error) => {
        setIsGettingLocation(false);
        console.error("Geolocation error:", error);
        toastError("Не удалось определить местоположение. Разрешите доступ к геолокации.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = () => {
    if (selectedLat && selectedLng) {
      onSelect(selectedLat, selectedLng, locationName || undefined);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="24px" fontWeight="700">
            Выберите местоположение на карте
          </Text>
        </ModalHeader>
        <ModalBody p={0}>
          <Box h="500px" w="100%" position="relative">
            <MapContainer
              key={`${initialLat}-${initialLng}`}
              center={
                initialLat && initialLng 
                  ? [initialLat, initialLng] 
                  : selectedLat && selectedLng 
                    ? [selectedLat, selectedLng] 
                    : [41.311081, 69.240562]
              }
              zoom={initialLat && initialLng ? 15 : 13}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                onSelect={handleMapClick}
                initialLat={selectedLat}
                initialLng={selectedLng}
                currentPosition={currentPosition}
              />
            </MapContainer>
            <Button
              position="absolute"
              top="20px"
              right="20px"
              leftIcon={<MdMyLocation />}
              colorScheme="blue"
              onClick={handleGetCurrentLocation}
              isLoading={isGettingLocation}
              loadingText="Определение..."
              zIndex={1000}
              boxShadow="lg"
            >
              Моё местоположение
            </Button>
            {selectedLat && selectedLng && (
              <Box
                position="absolute"
                bottom="20px"
                left="20px"
                bg="white"
                p="15px"
                borderRadius="8px"
                boxShadow="lg"
                zIndex={1000}
                maxW="400px"
              >
                <Text fontSize="14px" fontWeight="600" mb="8px">
                  Выбранное местоположение:
                </Text>
                {isLoadingLocation ? (
                  <HStack spacing="10px">
                    <Spinner size="sm" />
                    <Text fontSize="12px" color="#718096">
                      Загрузка адреса...
                    </Text>
                  </HStack>
                ) : locationName ? (
                  <Text fontSize="13px" fontWeight="500" color="#2D3748" mb="8px">
                    {locationName}
                  </Text>
                ) : null}
                <Box mt="8px" pt="8px" borderTop="1px solid #E2E8F0">
                  <Text fontSize="12px" color="#718096">
                    Широта: {selectedLat.toFixed(6)}
                  </Text>
                  <Text fontSize="12px" color="#718096">
                    Долгота: {selectedLng.toFixed(6)}
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </ModalBody>
        <ModalFooter gap="15px">
          <Btn mode="cancel" onClick={onClose}>
            Отмена
          </Btn>
          <Button
            colorScheme="green"
            onClick={handleConfirm}
            isDisabled={!selectedLat || !selectedLng}
          >
            Подтвердить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


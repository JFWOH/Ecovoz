import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Search, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './styles/map.css';

// Correção para o ícone do marcador do Leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: null,
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function MapClickHandler({ isAddingMarker, onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      if (isAddingMarker) {
        onLocationSelect(e.latlng);
      }
    },
  });
  return null;
}

function App() {
  const [markers, setMarkers] = useState(() => {
    const savedMarkers = localStorage.getItem('ecoVozMarkers');
    return savedMarkers ? JSON.parse(savedMarkers) : [];
  });

  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapRef, setMapRef] = useState(null);
  const [newMarkerInfo, setNewMarkerInfo] = useState({
    name: '',
    description: '',
    type: 'park'
  });
  const saveMarkers = (newMarkers) => {
    localStorage.setItem('ecoVozMarkers', JSON.stringify(newMarkers));
    setMarkers(newMarkers);
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
  };

  const handleSaveMarker = () => {
    if (!selectedLocation || !newMarkerInfo.name) return;

    const newMarker = {
      id: Date.now(),
      position: [selectedLocation.lat, selectedLocation.lng],
      ...newMarkerInfo
    };

    const updatedMarkers = [...markers, newMarker];
    saveMarkers(updatedMarkers);
    setIsAddingMarker(false);
    setSelectedLocation(null);
    setNewMarkerInfo({ name: '', description: '', type: 'park' });
  };

  const handleRemoveMarker = (markerId) => {
    const updatedMarkers = markers.filter(marker => marker.id !== markerId);
    saveMarkers(updatedMarkers);
  };

  const filteredMarkers = markers.filter(marker => {
    const searchLower = searchTerm.toLowerCase();
    return (
      marker.name.toLowerCase().includes(searchLower) ||
      marker.description.toLowerCase().includes(searchLower) ||
      (marker.type === 'park' && 'parque'.includes(searchLower)) ||
      (marker.type === 'garden' && 'jardim'.includes(searchLower)) ||
      (marker.type === 'square' && 'praça'.includes(searchLower))
    );
  });

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6" />
          <h1 className="text-xl font-bold">EcoVoz</h1>
          <span className="text-sm bg-green-700 px-2 py-1 rounded-full">
            {markers.length} pontos
          </span>
        </div>
      </header>

      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <MapContainer 
            center={[-23.5505, -46.6333]}
            zoom={13} 
            className="w-full h-full"
            zoomControl={true}
            ref={setMapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapClickHandler 
              isAddingMarker={isAddingMarker} 
              onLocationSelect={handleLocationSelect}
            />
            {filteredMarkers.map((marker) => (
              <Marker 
                key={marker.id} 
                position={marker.position}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{marker.name}</h3>
                    <p className="text-sm">{marker.description}</p>
                    <p className="text-xs text-gray-500">
                      {marker.type === 'park' ? 'Parque' : 
                       marker.type === 'garden' ? 'Jardim' : 'Praça'}
                    </p>
                    <button 
                      onClick={() => handleRemoveMarker(marker.id)}
                      className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>Local selecionado</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="absolute top-4 left-4 right-4 z-[400]">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex items-center p-3">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar área verde..."
                className="w-full outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && filteredMarkers.length > 0 && (
              <div className="border-t max-h-60 overflow-y-auto">
                {filteredMarkers.map(marker => (
                  <div 
                    key={marker.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      if (mapRef) {
                        mapRef.setView(marker.position, 16, {
                          animate: true,
                          duration: 1
                        });
                        
                        // Encontra e abre o popup do marcador
                        const markerLayer = Object.values(mapRef._layers).find(
                          layer => layer._latlng && 
                          layer._latlng.lat === marker.position[0] && 
                          layer._latlng.lng === marker.position[1]
                        );
                        
                        if (markerLayer && markerLayer.openPopup) {
                          setTimeout(() => {
                            markerLayer.openPopup();
                          }, 1000);
                        }
                      }
                      setSearchTerm('');
                    }}
                  >
                    <div>
                      <div className="font-bold">{marker.name}</div>
                      <div className="text-sm text-gray-600">
                        {marker.type === 'park' ? 'Parque' : 
                         marker.type === 'garden' ? 'Jardim' : 'Praça'}
                      </div>
                    </div>
                    <div className="text-green-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isAddingMarker && (
          <div className="absolute top-20 left-4 right-4 z-[400]">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-bold mb-2">Nova Área Verde</h3>
              {!selectedLocation ? (
                <p className="text-gray-600 mb-2">Clique no mapa para selecionar a localização</p>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Nome da área"
                    className="w-full p-2 mb-2 border rounded"
                    value={newMarkerInfo.name}
                    onChange={(e) => setNewMarkerInfo({...newMarkerInfo, name: e.target.value})}
                  />
                  <textarea
                    placeholder="Descrição"
                    className="w-full p-2 mb-2 border rounded"
                    value={newMarkerInfo.description}
                    onChange={(e) => setNewMarkerInfo({...newMarkerInfo, description: e.target.value})}
                  />
                  <select
                    className="w-full p-2 mb-2 border rounded"
                    value={newMarkerInfo.type}
                    onChange={(e) => setNewMarkerInfo({...newMarkerInfo, type: e.target.value})}
                  >
                    <option value="park">Parque</option>
                    <option value="garden">Jardim</option>
                    <option value="square">Praça</option>
                  </select>
                </>
              )}
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setIsAddingMarker(false);
                    setSelectedLocation(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
                {selectedLocation && (
                  <button 
                    onClick={handleSaveMarker}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Salvar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <button 
          className={`absolute bottom-6 right-6 z-[400] ${
            isAddingMarker ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
          } text-white p-4 rounded-full shadow-lg transition-colors`}
          onClick={() => setIsAddingMarker(!isAddingMarker)}
        >
          <Plus className={`h-6 w-6 ${isAddingMarker ? 'rotate-45' : ''} transition-transform`} />
        </button>
      </main>
    </div>
  );
}

export default App;
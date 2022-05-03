import { IonCol, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonModal, useIonViewWillEnter } from '@ionic/react';
import { useRef, useState } from 'react';
import './Home.css';

import { GoogleMap } from '@capacitor/google-maps';
import { markers } from '../data';
import { MarkerInfoWindow } from '../components/MarkerInfoWindow';

const Home = () => {

  const key = "AIzaSyBJwKYcub1yNcDd2V8iu4ZfGvDi4eW_fpU";
  let newMap;
  const mapRef = useRef(null);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const [present, dismiss] = useIonModal(MarkerInfoWindow, {

    marker: selectedMarker
  });

  const modalOptions = {

    initialBreakpoint: 0.4,
    breakpoints: [0, 0.4],
    backdropBreakpoint: 0,
    onDidDismiss: () => dismiss()
  };

  const [mapConfig, setMapConfig] = useState({
    
    zoom: 10,
    center: {

      lat: markers[0].lat,
      lng: markers[0].lng
    }
  });

  const markerClick = marker => {

    setSelectedMarker(markers.filter(m => (m.lat === marker.latitude && m.lng === marker.longitude))[0]);
    present(modalOptions);
  }

  const addMapMarker = async marker => {

    await newMap.addMarker({
      
      coordinate: { 
        lat: marker.lat, 
        lng: marker.lng
      },
      title: marker.title
    });
  }

  const addMapMarkers = () => markers.forEach(marker => addMapMarker(marker));

  const createMap = async () => {

    if (!mapRef.current) return;

    newMap = await GoogleMap.create({
      id: "google-map",
      element: mapRef.current,
      apiKey: key,
      config: mapConfig
    });

    newMap.setOnMarkerClickListener((marker) => markerClick(marker));
    addMapMarkers();
  }

  useIonViewWillEnter(() => createMap());

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Capacitor Google Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Capacitor Google Map</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRow>
          <IonCol size="12">
            <capacitor-google-map ref={mapRef} id="map"></capacitor-google-map>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Home;
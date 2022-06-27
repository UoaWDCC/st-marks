// import { randomInt } from "crypto";
// import { useCookies } from "react-cookie";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IPlot, IPerson } from "../../../types/schema";
import averageCoordinates from "./utils/averageCoordinates";
import { getCookie } from "typescript-cookie";
import { url } from "inspector";

interface InteractiveMapProps {
  plots: IPlot[];
  selectedPlot: IPlot | undefined;
  onClick: (plotNumber: number) => void;
  showLocation: boolean;
  className: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  plots,
  selectedPlot,
  onClick,
  showLocation,
  className,
}: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  const darkMode = getCookie("darkMode");
  // const [cookies, setCookie] = useCookies(["user"]);

  // // Memorise map instance
  // // initialise mapId
  const mapId: string =
    darkMode == "true" ? "c1b071c4df766122" : "22722d672fb630c2";

  useEffect(() => {
    if (mapRef.current) {
      setMap(
        new google.maps.Map(mapRef.current, {
          center: { lat: -36.8728, lng: 174.78028 },
          zoom: 19,
          minZoom: 18,
          restriction: {
            latLngBounds: {
              north: -36.87,
              south: -36.875,
              east: 174.785,
              west: 174.775,
            },
          },
          // tilt: 0,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: true,
          mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite"],
          },
          mapId: mapId,

        })
      );
    }
  }, [mapRef, mapId]);

  // Memorise map instance
  // dark mapId: "22722d672fb630c2"
  //let mapId = "c1b071c4df766122";
  //if (global.darkMode) {
  //mapId = "22722d672fb630c2";
  //}
  // Initialise overlay

  useEffect(() => {
    if (map) {
      new google.maps.GroundOverlay(
        "https://storage.googleapis.com/smg-images/map-in-chunks-rotated-3.png",
        {
          north: -36.872385,
          south: -36.873336,
          east: 174.780744,
          west: 174.779711,
        }
      ).setMap(map);
    }
  }, [map]);

  const [polygonsByNumber, setPolygonsByNumber] =
    useState<Map<number, google.maps.Polygon>>();

  // Initialise plots
  useEffect(() => {
    const polygons = plots.reduce((polygonMap, plot) => {
      const polygon = new google.maps.Polygon({
        paths: plot.coordinates,
        strokeColor: "#428BCA",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#428BCA",
        fillOpacity: 0.2,
      });
      polygon.setMap(map ?? null);

      const infowindow = new google.maps.InfoWindow({
        content:
          "<h2>" + plot.registeredName + " Plot #" + plot.plotNumber + "</h2>"
          + "<b>" + "<p>Number of People: " + plot.buried.length + "</p>" + "</b>" +
          plot.buried.map((person: IPerson) => (
            "<p></p>" + person.fullName
          ))
      });

      const point = averageCoordinates(plot.coordinates);

      polygon.addListener("mouseover", () => {
        infowindow.setPosition(point);
        infowindow.open(map);
      });
      polygon.addListener("mouseout", () => {
        infowindow.close();
      });

      return polygonMap.set(plot.plotNumber, polygon);
    }, new Map<number, google.maps.Polygon>());

    setPolygonsByNumber(polygons);

    return () => polygons.forEach((polygon) => polygon.setMap(null));
  }, [map, plots]);

  // Initialise click listeners
  useEffect(() => {
    if (polygonsByNumber) {
      const listeners = Array.from(polygonsByNumber.entries()).map(
        ([number, polygon]) => {
          return polygon.addListener("click", () => onClick(number));
        }
      );
      return () => listeners.forEach((listener) => listener.remove());
    }
  }, [polygonsByNumber, onClick]);

  // Selected plot marker
  const selectedPlotMarker = useMemo(() => new google.maps.Marker(), []);

  useEffect(() => {
    if (selectedPlot) {
      const coordinates = averageCoordinates(selectedPlot.coordinates);

      selectedPlotMarker.setPosition(coordinates);

      map?.setCenter(coordinates);

      if (!selectedPlotMarker.getMap() && map) {
        selectedPlotMarker.setMap(map);
      }
    } else {
      selectedPlotMarker.setMap(null);
    }
  }, [map, selectedPlot, selectedPlotMarker]);

  // Geolocation marker
  const geolocationMarker = useMemo(
    () =>
      new google.maps.Marker({
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
          scale: 10,
        },
      }),
    []
  );

  const mapTypeControl = (controlDiv: HTMLElement, map: google.maps.Map) => {

    const controlDivStyles = {
      borderRadius: "8px",
      border: "2px solid white",
      boxShadow: "rgba(0, 0, 0, 0.3) 0px 1px 4px",
      boxSizing: "border-box",
      height: "79px",
      opacity: 1,
      width: "79px",
      transition: "none 0s ease 0s",
      marginBottom: "15px",
    }

    Object.assign(controlDiv.style, controlDivStyles);

    const imageDiv = document.createElement("div");
    const imageDivStyles = {
      borderRadius: "6px",
      inset: "0px",
      position: "absolute",
      backgroundImage: `url(${'https://www.google.com/maps/vt/pb=!1m5!1m4!1i15!2i64585!3i39998!4i128!2m2!1e1!3i927!3m9!2sen!3sus!5e1105!12m1!1e4!12m1!1e47!12m1!1e3!4e0!5m2!1e0!5f2!23i10203575!23i1381033!23i1368782!23i1368785!23i47025228!23i4592408!23i1375050!23i4536287'})`,
      backgroundSize: 'cover',

    }
    Object.assign(imageDiv.style, imageDivStyles);

    // map type label
    const label = document.createElement("label");
    const labelStyles = {
      borderRadius: "6px",
      padding: "12px 0px 6px",
      cursor: "pointer",
      color: "white",
      fontSize: "11px",
      position: "absolute",
      lineHeight: "normal",
      bottom: "0px",
      left: "0px",
      width: "100%",
      backgroundImage: "linear-gradient(transparent, rgba(0, 0, 0, 0.6))",
      height: "15px",
      textShadow: "rgba(0, 0, 0, 0.7) 0px 1px 8px",
      textAlign: "center",
      textIndent: "0px",
    }
    label.innerHTML = "Satellite"
    Object.assign(label.style, labelStyles);

    // button
    const button = document.createElement("button");
    const buttonStyles = {
      background: "transparent",
      border: "0px",
      borderRadius: "0px",
      font: "inherit",
      margin: "0px",
      outline: "0px",
      padding: "0px",
      color: "inherit",
      position: "absolute",
      width: "100%",
      height: "100%",
      cursor: "pointer",
    }

    Object.assign(button.style, buttonStyles);

    controlDiv.appendChild(imageDiv);
    controlDiv.appendChild(label);
    controlDiv.appendChild(button);

  }

  // create satellite map button
  useEffect(() => {
    const controlDiv = document.createElement("div");
    map && mapTypeControl(controlDiv, map);

    map && map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);

  }, [map])

  useEffect(() => {
    if (showLocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        geolocationMarker.setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        if (!geolocationMarker.getMap() && map) {
          geolocationMarker.setMap(map);
        }

        return () => navigator.geolocation.clearWatch(watchId);
      });
    } else {
      geolocationMarker.setMap(null);
    }
  }, [map, geolocationMarker, showLocation]);

  return <div ref={mapRef} className={className} data-testid="map" />;
};

export default InteractiveMap;
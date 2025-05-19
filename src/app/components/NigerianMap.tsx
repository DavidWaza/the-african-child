"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

interface GeoJSONFeature {
  type: string;
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

const geoUrl = "/ng.json"; // Assuming this is a local path to your GeoJSON file

// Dummy list of supported states
const DUMMY_SUPPORTED_STATES: string[] = [
  "Lagos",
  "Rivers",
  "Kano",
  "Abuja (FCT)",
];
const SUPPORTED_COLOR = "#FDC700"; // yellow (user updated)
const NOT_SUPPORTED_COLOR = "#417667"; // Green (user updated)
const DEFAULT_COLOR = "#EEE"; // Default grey

// Interface for school details
interface School {
  name: string;
  // you can add more details like id, address, etc.
}

interface StateInfo {
  name: string;
  description: string;
  color: string;
  details?: string;
  status?: "Supported" | "Not Supported";
  supportedSchools?: School[]; // Changed from generic data to specific school list
}

const getLuminance = (hexColor: string): number => {
  if (!hexColor || hexColor.length < 4) return 0;
  const rgb = hexColor
    .replace("#", "")
    .match(/.{1,2}/g)!
    .map((c) => parseInt(c, 16));
  const [r, g, b] = rgb;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

// Modal Component
const StateModal: React.FC<{
  stateInfo: StateInfo | null;
  onClose: () => void;
}> = ({ stateInfo, onClose }) => {
  if (!stateInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000] p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeIn">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-2xl font-bold" style={{ color: stateInfo.color }}>
            {stateInfo.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="space-y-3 text-gray-700 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          <p>
            <span className="font-semibold">Status:</span> {stateInfo.status}
          </p>
          <p>
            <span className="font-semibold">Details:</span> {stateInfo.details}
          </p>

          {stateInfo.status === "Supported" &&
            stateInfo.supportedSchools &&
            stateInfo.supportedSchools.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-800">
                  Supported Schools:
                </h3>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {stateInfo.supportedSchools.map((school, index) => (
                    <li key={index} className="text-gray-600">
                      <a
                        href={`#school-${school.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, this would navigate or show more school info
                          console.log(`Clicked school: ${school.name}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {school.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {stateInfo.status === "Supported" &&
            (!stateInfo.supportedSchools ||
              stateInfo.supportedSchools.length === 0) && (
              <p className="mt-3 text-gray-600">
                Information on specific schools in this state is currently being
                updated.
              </p>
            )}
          {stateInfo.status === "Not Supported" && (
            <p className="mt-3 text-gray-600">
              This state is not currently listed under our direct school support
              program.
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          // User updated color for close button
          className="mt-4 w-full bg-[#417667] hover:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Close
        </button>
      </div>
      {/* Basic CSS for modal animation */}
      <style jsx global>{`
        @keyframes modalFadeInAnimation {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalFadeIn {
          animation: modalFadeInAnimation 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const NigeriaMap: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStateData, setSelectedStateData] = useState<StateInfo | null>(
    null
  );

  useEffect(() => {
    // No initial data fetching needed for this version
  }, []);

  const handleStateClick = (stateInfo: StateInfo) => {
    setSelectedStateData(stateInfo);
    setIsModalOpen(true);
    setTooltipContent("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!mapRef.current || isModalOpen) return;
    const mapBounds = mapRef.current.getBoundingClientRect();
    const tooltipWidth = 250;
    const tooltipHeight = 100;
    const offsetX = 15;
    const offsetY = 15;

    let x = event.clientX + offsetX;
    let y = event.clientY + offsetY;

    if (x < mapBounds.left) x = mapBounds.left + 5;
    if (x + tooltipWidth > mapBounds.right)
      x = mapBounds.right - tooltipWidth - 5;
    if (y < mapBounds.top) y = mapBounds.top + 5;
    if (y + tooltipHeight > mapBounds.bottom)
      y = mapBounds.bottom - tooltipHeight - 5;

    setTooltipPosition({
      x: x - mapBounds.left,
      y: y - mapBounds.top,
    });
  };

  // Generates dummy school data for supported states
  const getDummySchoolData = (stateName: string): School[] => {
    if (!DUMMY_SUPPORTED_STATES.includes(stateName)) {
      return [];
    }
    // Generate 2-4 dummy schools based on state name
    const schoolCount = (stateName.length % 3) + 2; // Generates 2, 3, or 4
    const schools: School[] = [];
    for (let i = 1; i <= schoolCount; i++) {
      schools.push({ name: `${stateName} Model School ${i}` });
    }
    if (stateName === "Lagos") {
      // Add some specific examples
      schools.push({ name: "King's College, Lagos" });
      schools.push({ name: "Queen's College, Yaba" });
    }
    if (stateName === "Kano") {
      schools.push({ name: "Rumfa College, Kano" });
    }
    return schools;
  };

  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-black text-center pt-10 lg:pt-20 text-2xl lg:text-6xl font-bold">
        Our Supported States
      </h1>
      <div className="w-full flex justify-center items-center py-8">
        <div
          ref={mapRef}
          className="relative w-full md:w-4/5 lg:w-3/4 xl:w-2/3  overflow-hidden p-3 "
          onMouseMove={handleMouseMove}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 3300,
              center: [8.5, 9.5] as [number, number],
            }}
            className="w-full h-full rounded-lg" // Added rounded-lg to map itself
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: GeoJSONFeature[] }) =>
                geographies.map((geo) => {
                  const stateName: string = geo.properties.name;
                  const isSupported =
                    DUMMY_SUPPORTED_STATES.includes(stateName);

                  const currentStatus = isSupported
                    ? "Supported"
                    : "Not Supported";
                  const color = isSupported
                    ? SUPPORTED_COLOR
                    : NOT_SUPPORTED_COLOR;

                  const schoolsInState = getDummySchoolData(stateName);

                  const stateInfo: StateInfo = {
                    name: stateName,
                    description: `Current status of NGO activities in ${stateName}.`, // Generic description
                    color: color,
                    details: isSupported
                      ? `Our NGO actively supports educational initiatives in ${stateName}.`
                      : `We are currently evaluating opportunities to expand our support to ${stateName}.`,
                    status: currentStatus,
                    supportedSchools: schoolsInState,
                  };

                  const [centerX, centerY] = geoCentroid(geo.geometry) as [
                    number,
                    number
                  ];
                  const isHovered = hoveredState === stateName;
                  const baseFillColor = stateInfo.color || DEFAULT_COLOR;
                  const hoverFillColor = isSupported ? "#EAB308" : "#059669";

                  const luminance = getLuminance(
                    isHovered ? hoverFillColor : baseFillColor
                  );
                  // For yellow background, black text is usually better.
                  const textColor =
                    isSupported && !isHovered
                      ? "#374151"
                      : luminance > 0.45
                      ? "#000000"
                      : "#FFFFFF";

                  return (
                    <g
                      key={geo.properties.name || JSON.stringify(geo.geometry)}
                      onClick={() => handleStateClick(stateInfo)}
                      style={{ cursor: "pointer" }}
                      className="outline-none focus:outline-none" // For potential accessibility tabbing
                      tabIndex={0} // Make it focusable
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleStateClick(stateInfo);
                      }} // Keyboard accessibility
                    >
                      <Geography
                        geography={geo}
                        onMouseEnter={() => {
                          if (isModalOpen) return;
                          setHoveredState(stateName);
                          setTooltipContent(
                            `${stateName}\nStatus: ${currentStatus}\nClick for more details.`
                          );
                        }}
                        onMouseLeave={() => {
                          setHoveredState(null);
                          setTooltipContent("");
                        }}
                        style={{
                          default: {
                            fill: baseFillColor,
                            stroke: "#FFFFFF",
                            strokeWidth: 0.75,
                            outline: "none",
                            transition:
                              "fill 0.2s ease-in-out, stroke-width 0.2s ease-in-out",
                          },
                          hover: {
                            fill: hoverFillColor,
                            stroke: isSupported ? "#D97706" : "#047857", // Darker stroke on hover
                            strokeWidth: 1.5,
                            outline: "none",
                          },
                          pressed: {
                            fill: isSupported ? "#CA8A04" : "#047857",
                            stroke: isSupported ? "#B45309" : "#065F46",
                            strokeWidth: 1.5,
                            outline: "none",
                          },
                        }}
                      />
                      {centerX && centerY && (
                        <Annotation
                          subject={[centerX, centerY] as [number, number]}
                          dx={0}
                          dy={0}
                          connectorProps={{ stroke: "transparent" }}
                        >
                          <text
                            x={0} // Centered by textAnchor
                            y={0} // Centered by alignmentBaseline
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            style={{
                              fontSize:
                                stateName.length > 10 ? "6.5px" : "8.5px", // Adjusted for clarity
                              fontWeight: "600",
                              textTransform: "uppercase",
                              pointerEvents: "none",
                              fill: textColor,
                              paintOrder: "stroke", // Render stroke under fill
                              stroke:
                                luminance < 0.5 && !(isSupported && !isHovered)
                                  ? "rgba(0,0,0,0.2)"
                                  : "rgba(255,255,255,0.2)",
                              strokeWidth: "0.75px", // Slightly thicker for better definition
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }}
                          >
                            {stateName}
                          </text>
                        </Annotation>
                      )}
                    </g>
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {!isModalOpen && tooltipContent && (
            <div
              className="absolute bg-gray-900 text-white shadow-2xl p-3 rounded-md z-[100] pointer-events-none max-w-xs text-sm opacity-95"
              style={{
                top: `${tooltipPosition.y}px`,
                left: `${tooltipPosition.x}px`,
                transition:
                  "top 0.05s ease-out, left 0.05s ease-out, opacity 0.1s ease-in-out",
              }}
            >
              {tooltipContent.split("\n").map((line, i) => (
                <p
                  key={i}
                  className={`${
                    i === 0
                      ? "font-bold text-base mb-1 text-yellow-400" // Highlight state name
                      : i === 1
                      ? "text-gray-300 mb-0.5"
                      : "text-gray-400 text-xs italic" // Italicize "Click for more details"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
        {isModalOpen && (
          <StateModal
            stateInfo={selectedStateData}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default NigeriaMap;

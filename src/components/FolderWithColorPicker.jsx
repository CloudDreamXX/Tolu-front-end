import React, { useState, useRef, useEffect } from "react";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { SketchPicker } from "react-color";
import { useSelector, useDispatch } from "react-redux";
import { setFolderColor } from "../redux/slice/folderColorSlice"; // adjust the path as needed

// Define your default colors
const defaultIconColor = "#000000";
const defaultBgColor = "rgba(0, 0, 0, 0.2)";


const FolderWithColorPicker = ({ folderId }) => {
  const dispatch = useDispatch();

  // Get the folder's color settings from Redux by folderId
  const folder = useSelector((state) =>
    state.folderColor.folderColors.find((f) => f.folderId === folderId)
  );
  const allFolder = useSelector((state) =>
    state.folderColor.folderColors
  );


  // If the folder is not yet in the state, add it with default colors
  useEffect(() => {
    if (!folder) {
      dispatch(
        setFolderColor({
          folderId,
          iconColor: defaultIconColor,
          bgColor: defaultBgColor,
        })
      );
    }
  }, [folder, folderId, dispatch]);

  // Use the folder's colors or fallback to defaults
  const iconColor = folder ? folder.iconColor : defaultIconColor;
  const bgColor = folder ? folder.bgColor : defaultBgColor;

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // Helper to generate a low-opacity background color from a hex value
  const getLowOpacityColor = (hex, opacity = 0.2) => {
    let normalizedHex = hex.replace("#", "");
    if (normalizedHex.length === 3) {
      normalizedHex = normalizedHex.split("").map((ch) => ch + ch).join("");
    }
    const r = parseInt(normalizedHex.substring(0, 2), 16);
    const g = parseInt(normalizedHex.substring(2, 4), 16);
    const b = parseInt(normalizedHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Close the color picker if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  // When a new color is selected, update Redux and close the picker
  const handleColorChangeComplete = (selectedColor) => {
    const newIconColor = selectedColor.hex;
    const newBgColor = getLowOpacityColor(newIconColor);
    dispatch(
      setFolderColor({ folderId, iconColor: newIconColor, bgColor: newBgColor })
    );
    setShowPicker(false);
  };

  return (
    <div className="relative inline-block">
      {/* Folder Icon with colors from Redux */}
      <section
        className="relative w-12 h-12 flex items-center justify-center rounded-full mr-2 group cursor-pointer"
        style={{ backgroundColor: bgColor }}
      >
        <FaRegFolderOpen className="text-xl" style={{ color: iconColor }} />

        {/* Edit Icon (appears on hover) */}
        <section
          className="absolute top-0 right-0 text-primary bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering parent's onClick
            setShowPicker(!showPicker);
          }}
        >
          <MdEdit className="text-xs text-black" />
        </section>
      </section>

      {/* Color Picker */}
      {showPicker && (
        <div ref={pickerRef} className="absolute top-full mt-2 left-0 z-50 shadow-lg">
          <SketchPicker color={iconColor} onChangeComplete={handleColorChangeComplete} />
        </div>
      )}
    </div>
  );
};

export default FolderWithColorPicker;

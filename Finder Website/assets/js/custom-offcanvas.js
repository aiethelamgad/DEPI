(() => {
    "use strict";

    // Utility functions
    const getFromStorage = (key) => localStorage.getItem(key);
    const setToStorage = (key, value) => localStorage.setItem(key, value);

    // Convert hex to RGB string
    const hexToRgb = (hex) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length === 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        return `${+r},${+g},${+b}`;
    };

    // Mix two colors
    const mixColors = (color1, color2, percentage) => {
        const amount = Math.max(0, Math.min(100, percentage)) / 100;
        const parseRgb = (color) => color.split(",").map(c => parseInt(c));
        const rgb1 = parseRgb(hexToRgb(color1));
        const rgb2 = parseRgb(hexToRgb(color2));

        const r = Math.round(rgb1[0] * amount + rgb2[0] * (1 - amount));
        const g = Math.round(rgb1[1] * amount + rgb2[1] * (1 - amount));
        const b = Math.round(rgb1[2] * amount + rgb2[2] * (1 - amount));

        return "#" + [r, g, b].map(c => {
            const hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    };

    // Lighten or darken color
    const adjustColor = (color, amount) => {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const prefix = "fn-";
    const colorTypes = ["primary", "success", "warning", "danger", "info"];

    // Initialize customizer
    const initCustomizer = () => {
        const customizer = document.getElementById("customizer");
        const backdrop = document.getElementById("customizer-backdrop");
        const trigger = document.getElementById("customizer-trigger");
        const closeBtn = document.getElementById("customizer-close");

        // Show customizer
        const showCustomizer = () => {
                customizer.classList.add("show", "customizer-panel-right");
                backdrop.classList.add("show");
                document.body.style.overflow = "hidden";
        };

        // Hide customizer
        const hideCustomizer = () => {
                customizer.classList.remove("show", "customizer-panel-right");
                backdrop.classList.remove("show");
                document.body.style.overflow = "";
        };

        // Event listeners
        trigger.addEventListener("click", showCustomizer);
        closeBtn.addEventListener("click", hideCustomizer);
        backdrop.addEventListener("click", hideCustomizer);

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && customizer.classList.contains("show")) {
                hideCustomizer();
            }
        });
    };

    // Update CSS custom properties
    const updateCSSProperty = (property, value) => {
        document.documentElement.style.setProperty(`--${prefix}${property}`, value);
    };

    // Initialize color controls
    const initColorControls = () => {
        document.querySelectorAll("#theme-colors .color-swatch").forEach(swatch => {
            const colorInput = swatch.querySelector(".color-input");
            const colorPicker = swatch.querySelector(".color-picker");
            const colorPreview = swatch.querySelector(".color-preview");
            const colorId = colorPicker.id;

            // Load saved values
            const savedColor = getFromStorage(`theme-${colorId}`);
            if (savedColor) {
                colorInput.value = savedColor;
                colorPicker.value = savedColor;
                colorPreview.style.backgroundColor = savedColor;
                updateCSSProperty(colorId, savedColor);
                updateCSSProperty(`${colorId}-rgb`, hexToRgb(savedColor));
            }

            // Color picker change
            colorPicker.addEventListener("input", (e) => {
                const color = e.target.value;
                updateColor(colorId, color, colorInput, colorPreview);
            });

            // Text input change
            colorInput.addEventListener("change", (e) => {
                const color = e.target.value;
                if (color.length > 0 && color.startsWith("#")) {
                    updateColor(colorId, color, colorPicker, colorPreview);
                }
            });

            // Preview click
            colorPreview.addEventListener("click", () => {
                colorPicker.click();
            });
        });
    };

    // Update color and related properties
    const updateColor = (colorId, color, otherInput, preview) => {
        // Update UI
        otherInput.value = color;
        preview.style.backgroundColor = color;

        // Save to localStorage
        setToStorage(`theme-${colorId}`, color);
        setToStorage(`theme-${colorId}-rgb`, hexToRgb(color));

        // Update CSS properties
        updateCSSProperty(colorId, color);
        updateCSSProperty(`${colorId}-rgb`, hexToRgb(color));

        // Generate additional color variants
        const textEmphasis = adjustColor(color, -10);
        const bgSubtle = mixColors("#ffffff", color, 90);
        const borderSubtle = mixColors("#ffffff", color, 80);
        const textEmphasisDark = adjustColor(color, -5);
        const bgSubtleDark = mixColors("#111827", color, 90);
        const borderSubtleDark = mixColors("#111827", color, 80);

        // Save variants
        setToStorage(`theme-${colorId}-text-emphasis`, textEmphasis);
        setToStorage(`theme-${colorId}-bg-subtle`, bgSubtle);
        setToStorage(`theme-${colorId}-border-subtle`, borderSubtle);
        setToStorage(`theme-${colorId}-text-emphasis-dark`, textEmphasisDark);
        setToStorage(`theme-${colorId}-bg-subtle-dark`, bgSubtleDark);
        setToStorage(`theme-${colorId}-border-subtle-dark`, borderSubtleDark);

        // Update CSS for variants
        updateCSSProperty(`${colorId}-text-emphasis`, textEmphasis);
        updateCSSProperty(`${colorId}-bg-subtle`, bgSubtle);
        updateCSSProperty(`${colorId}-border-subtle`, borderSubtle);
    };

    // Initialize RTL toggle
    const initRTLToggle = () => {
        const rtlSwitch = document.getElementById("rtl-switch");
        const savedDirection = getFromStorage("direction") || "ltr";

        // Set initial state
        document.documentElement.setAttribute("dir", savedDirection);
        rtlSwitch.checked = savedDirection === "rtl";

        // Handle change
        rtlSwitch.addEventListener("change", () => {
            const direction = rtlSwitch.checked ? "rtl" : "ltr";
            setToStorage("direction", direction);
            document.documentElement.setAttribute("dir", direction);
        });
    };

    // Initialize slider controls
    const initSliderControls = () => {
        document.querySelectorAll(".slider-input").forEach(container => {
            const rangeInput = container.querySelector(".range-slider");
            const numberInput = container.querySelector(".number-input");

            // Sync range and number inputs
            rangeInput.addEventListener("input", () => {
                numberInput.value = rangeInput.value;
            });

            numberInput.addEventListener("input", () => {
                rangeInput.value = numberInput.value;
            });
        });

        // Border width control
        const borderWidthInput = document.getElementById("border-width");
        const borderWidthRange = borderWidthInput.parentElement.querySelector(".range-slider");
        const savedBorderWidth = getFromStorage("theme-border-width");

        if (savedBorderWidth) {
            const value = parseInt(savedBorderWidth);
            borderWidthInput.value = value;
            borderWidthRange.value = value;
            updateCSSProperty("border-width", savedBorderWidth);
        }

        borderWidthInput.parentElement.addEventListener("input", (e) => {
            const value = e.target.value + "px";
            setToStorage("theme-border-width", value);
            updateCSSProperty("border-width", value);
        });

        // Border radius control
        const borderRadiusInput = document.getElementById("border-radius");
        const borderRadiusRange = borderRadiusInput.parentElement.querySelector(".range-slider");
        const savedBorderRadius = getFromStorage("theme-border-radius");

        if (savedBorderRadius) {
            const value = parseFloat(savedBorderRadius);
            borderRadiusInput.value = value;
            borderRadiusRange.value = value;
            updateCSSProperty("border-radius", savedBorderRadius);
        }

        borderRadiusInput.parentElement.addEventListener("input", (e) => {
            const value = e.target.value + "rem";
            setToStorage("theme-border-radius", value);
            updateCSSProperty("border-radius", value);
        });
    };

    // Initialize everything when DOM is loaded
    document.addEventListener("DOMContentLoaded", () => {
        initCustomizer();
        initColorControls();
        initRTLToggle();
        initSliderControls();

        // Load saved theme on page load
        colorTypes.forEach(colorType => {
            const savedColor = getFromStorage(`theme-${colorType}`);
            if (savedColor) {
                updateCSSProperty(colorType, savedColor);
                updateCSSProperty(`${colorType}-rgb`, hexToRgb(savedColor));
            }
        });

        // Load saved border settings
        const savedBorderWidth = getFromStorage("theme-border-width");
        if (savedBorderWidth) {
            updateCSSProperty("border-width", savedBorderWidth);
        }

        const savedBorderRadius = getFromStorage("theme-border-radius");
        if (savedBorderRadius) {
            updateCSSProperty("border-radius", savedBorderRadius);
        }
    });
})();

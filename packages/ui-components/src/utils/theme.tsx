import { colors } from "../theme/colors";

interface ColorPalette { [key: string]: { [key: string]: string | { [key: string]: string } | string } }

export const getCombinations = (colors: ColorPalette) => {
    return Object.keys(colors).map((key) => {
        const value = colors[key];
        if (typeof value === "object" && value !== null) {
            return Object.keys(value).map((subKey) => {
                const subValue = value[subKey];
                if (typeof subValue === "object" && subValue !== null) {
                    return Object.keys(subValue).map((shade) => shade === "DEFAULT" ? `${key}-${subKey}` : `${key}-${subKey}-${shade}`);
                } else {
                    return `${key}-${subKey}`;
                }
            }).flat();
        } else {
            return key;
        }
    }).flat();
}

export const colorClasses = ["bg", "text", "border", "fill"].map((prefix) => getCombinations(colors).map((color) => `${prefix}-${color}`)).flat();
export const variantColorClasses = ["hover", "focus", "active", "disabled"].map((variant) => colorClasses.map((colorClass) => `${variant}:${colorClass}`)).flat();
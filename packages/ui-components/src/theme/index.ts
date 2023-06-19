/* 
----------------------------------
    NATION 3 TAILWIND THEME CORE
----------------------------------

            @@@@@@            
      #@@@@@@@@@@@@@@@@@,     
    @@@@@@@@@@@ @@@@@@@@@@@   
  @@@@@@@@@@@@@  @@@@@@@@@@@@ 
 @@@@@@@@@@@@@@    @@@@@@@@@@@
@@@@@@@@@@@@@@@      #@@@@@@@@@
@@@@%          @@@@@@@@@@@@@@@@
@@@@@@@@@%     @@@@@@@@@@@@@@@@
 @@@@@@@@@@@   @@@@@@@@@@@@@@%
  @@@@@@@@@@@@ @@@@@@@@@@@@@. 
    @@@@@@@@@@@@@@@@@@@@@@(   
       @@@@@@@@@@@@@@@@&  
            @@@@@@

 */

// index.ts
import * as colors from "./colors";
import * as effects from "./effects";
import * as icons from "./icons";
import * as spacing from "./spacing";
import * as typography from "./typography";
import * as illustrations from "./illustrations";
import * as screens from "./screens";
import * as animations from "./animations";

import {grid} from './grid';

export default {
  ...colors,
  ...effects,
  ...icons,
  ...spacing,
  ...screens,
  ...typography,
  ...illustrations,
  ...grid,
  ...animations
};

// FIXME: Postcss doesn't find this if we include it in utils/theme.ts, so here they are
interface ColorPalette { [key: string]: { [key: string]: string | { [key: string]: string } | string } }

const getCombinations = (colors: ColorPalette) => {
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

export const colorClasses = ["bg", "text", "border", "fill"].map((prefix) => getCombinations(colors.colors).map((color) => `${prefix}-${color}`)).flat();
export const variantColorClasses = ["hover", "focus", "active", "disabled"].map((variant) => colorClasses.map((colorClass) => `${variant}:${colorClass}`)).flat();
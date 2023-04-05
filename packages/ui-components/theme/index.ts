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
import {grid} from './grid';

export default {
  ...colors,
  ...effects,
  ...icons,
  ...spacing,
  ...screens,
  ...typography,
  ...illustrations,
  ...grid
};
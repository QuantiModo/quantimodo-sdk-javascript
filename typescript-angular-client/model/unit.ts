/**
 * quantimodo
 * We make it easy to retrieve and analyze normalized user data from a wide array of devices and applications. Check out our [docs and sdk's](https://github.com/QuantiModo/docs) or [contact us](https://help.quantimo.do).
 *
 * OpenAPI spec version: 5.8.112511
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ConversionStep } from './conversionStep';
import { UnitCategory } from './unitCategory';


export interface Unit { 
    /**
     * Unit abbreviation
     */
    abbreviatedName: string;
    /**
     * Ex: 1
     */
    advanced?: number;
    /**
     * Options: Distance, Duration, Energy, Frequency, Miscellany, Pressure, Proportion, Rating, Temperature, Volume, Weight, Count
     */
    category: string;
    /**
     * Ex: 6
     */
    categoryId?: number;
    /**
     * Ex: Miscellany
     */
    categoryName?: string;
    /**
     * Conversion steps list
     */
    conversionSteps: Array<ConversionStep>;
    /**
     * Ex: 29
     */
    id?: number;
    /**
     * Ex: 0
     */
    manualTracking?: number;
    /**
     * The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
     */
    maximumAllowedValue?: number;
    /**
     * Ex: 4
     */
    maximumValue: number;
    /**
     * The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
     */
    minimumAllowedValue?: number;
    /**
     * Ex: 0
     */
    minimumValue?: number;
    /**
     * Unit name
     */
    name: string;
    unitCategory: UnitCategory;
}

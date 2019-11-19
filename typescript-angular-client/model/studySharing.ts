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


export interface StudySharing { 
    /**
     * Would you like to make this study publicly visible?
     */
    shareUserMeasurements: boolean;
    /**
     * Ex: N1 Study: Sleep Quality Predicts Higher Overall Mood
     */
    sharingDescription: string;
    /**
     * Ex: N1 Study: Sleep Quality Predicts Higher Overall Mood
     */
    sharingTitle: string;
}

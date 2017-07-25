# QMApi.Correlation

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**averageDailyLowCause** | **Number** |  | [optional] 
**averageDailyHighCause** | **Number** |  | [optional] 
**averageEffect** | **Number** |  | [optional] 
**averageEffectFollowingHighCause** | **Number** |  | [optional] 
**averageEffectFollowingLowCause** | **Number** |  | [optional] 
**averageEffectFollowingHighCauseExplanation** | **String** |  | [optional] 
**averageEffectFollowingLowCauseExplanation** | **String** |  | [optional] 
**averageVote** | **Number** | Average Vote | [optional] 
**causalityFactor** | **Number** |  | [optional] 
**cause** | **String** | Variable name of the cause variable for which the user desires correlations. | 
**causeVariableCategoryName** | **String** | Variable category of the cause variable. | [optional] 
**causeChanges** | **Number** | Number of changes in the predictor variable (a.k.a the number of experiments) | [optional] 
**causeVariableCombinationOperation** | **String** | The way cause measurements are aggregated | [optional] 
**causeVariableImageUrl** | **String** |  | [optional] 
**causeVariableIonIcon** | **String** | For use in Ionic apps | [optional] 
**causeUnit** | **String** | Unit of the predictor variable | [optional] 
**causeVariableDefaultUnitId** | **Number** | Unit Id of the predictor variable | [optional] 
**causeVariableId** | **Number** |  | [optional] 
**causeVariableName** | **String** | Variable name of the cause variable for which the user desires correlations. | [optional] 
**correlationCoefficient** | **Number** | Pearson correlation coefficient between cause and effect measurements | 
**createdAt** | **Date** | When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format | [optional] 
**dataAnalysis** | **String** | How the data was analyzed | [optional] 
**dataSources** | **String** | How the data was obtained | [optional] 
**durationOfAction** | **Number** | The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay. | 
**effect** | **String** | Variable name of the effect variable for which the user desires correlations. | 
**effectVariableCategoryName** | **String** | Variable category of the effect variable. | [optional] 
**effectVariableImageUrl** | **String** |  | [optional] 
**effectVariableIonIcon** | **String** | For use in Ionic apps | [optional] 
**effectSize** | **String** | Magnitude of the effects of a cause indicating whether it&#39;s practically meaningful. | [optional] 
**effectVariableId** | **String** | Magnitude of the effects of a cause indicating whether it&#39;s practically meaningful. | [optional] 
**effectVariableName** | **String** | Variable name of the effect variable for which the user desires correlations. | [optional] 
**gaugeImage** | **String** | Illustrates the strength of the relationship | [optional] 
**imageUrl** | **String** | Large image for Facebook | [optional] 
**numberOfPairs** | **Number** | Number of points that went into the correlation calculation | 
**onsetDelay** | **Number** | The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes. | 
**optimalPearsonProduct** | **Number** | Optimal Pearson Product | [optional] 
**outcomeDataSources** | **String** | original name of the cause. | [optional] 
**predictorExplanation** | **String** | HIGHER Remeron predicts HIGHER Overall Mood | [optional] 
**principalInvestigator** | **String** | Mike Sinn | [optional] 
**qmScore** | **Number** | Value representing the significance of the relationship as a function of crowdsourced insights, predictive strength, data quantity, and data quality | [optional] 
**reverseCorrelation** | **Number** | Correlation when cause and effect are reversed. For any causal relationship, the forward correlation should exceed the reverse correlation. | [optional] 
**significanceExplanation** | **String** | Using a two-tailed t-test with alpha &#x3D; 0.05, it was determined that the change... | [optional] 
**statisticalSignificance** | **String** | A function of the effect size and sample size | [optional] 
**strengthLevel** | **String** | weak, moderate, strong | [optional] 
**studyAbstract** | **String** | These data suggest with a high degree of confidence... | [optional] 
**studyBackground** | **String** | In order to reduce suffering through the advancement of human knowledge... | [optional] 
**studyDesign** | **String** | This study is based on data donated by one QuantiModo user... | [optional] 
**studyLimitations** | **String** | As with any human experiment, it was impossible to control for all potentially confounding variables... | [optional] 
**studyLinkDynamic** | **String** | Url for the interactive study within the web app | [optional] 
**studyLinkFacebook** | **String** | Url for sharing the study on Facebook | [optional] 
**studyLinkGoogle** | **String** | Url for sharing the study on Google+ | [optional] 
**studyLinkTwitter** | **String** | Url for sharing the study on Twitter | [optional] 
**studyLinkStatic** | **String** | Url for sharing the statically rendered study on social media | [optional] 
**studyObjective** | **String** | The objective of this study is to determine... | [optional] 
**studyResults** | **String** | This analysis suggests that... | [optional] 
**studyTitle** | **String** | N1 Study HIGHER Remeron predicts HIGHER Overall Mood | [optional] 
**timestamp** | **Number** | Time at which correlation was calculated | 
**updatedAt** | **Date** | When the record in the database was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local. | [optional] 
**userVote** | **Number** | User Vote | [optional] 
**valuePredictingHighOutcome** | **Number** | cause value that predicts an above average effect value (in default unit for cause variable) | [optional] 
**valuePredictingHighOutcomeExplanation** | **String** | Overall Mood, on average, 34% HIGHER after around 3.98mg Remeron | [optional] 
**valuePredictingLowOutcome** | **Number** | cause value that predicts a below average effect value (in default unit for cause variable) | [optional] 
**valuePredictingLowOutcomeExplanation** | **String** | Overall Mood, on average, 4% LOWER after around 0mg Remeron | [optional] 



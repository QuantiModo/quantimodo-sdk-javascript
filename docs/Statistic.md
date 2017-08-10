# Quantimodo.Statistic

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**correlationCoefficient** | **Number** | Example: 0.147 | 
**onsetDelay** | **Number** | Example: 0 | 
**durationOfAction** | **Number** | Example: 604800 | 
**numberOfPairs** | **Number** | Example: 297 | 
**effectSize** | **String** | Example: weakly positive | 
**statisticalSignificance** | **Number** | Example: 0.99987910063243 | 
**timestamp** | **Number** | Example: 1502080560 | 
**reversePearsonCorrelationCoefficient** | **String** | Example:  | 
**predictivePearsonCorrelationCoefficient** | **Number** | Example: 0.147 | 
**causalityFactor** | **Number** | Example: 0.147 | 
**causeVariableCategoryName** | **String** | Example: Environment | 
**effectVariableCategoryName** | **String** | Example: Activity | 
**valuePredictingHighOutcome** | **Number** | Example: 101187.2 | 
**valuePredictingLowOutcome** | **Number** | Example: 97597.75 | 
**optimalPearsonProduct** | **Number** | Example: 0.063550992332336 | 
**userVote** | **String** | Example:  | 
**averageVote** | **String** | Example:  | 
**causeVariableDefaultUnitId** | **Number** | Example: 47 | 
**createdAt** | **Date** | Example:  | 
**updatedAt** | **Date** | Example:  | 
**causeChanges** | **Number** | Example: 287 | 
**effectChanges** | **Number** | Example: 295 | 
**qmScore** | **String** | Example:  | 
**error** | **String** | Example: optimalPearsonProduct is not defined | 
**predictsHighEffectChange** | **Number** | Example: 0.84 | 
**predictsLowEffectChange** | **Number** | Example: -82.6 | 
**pValue** | **Number** | Example: 0 | 
**tValue** | **Number** | Example: 8.1106621038493 | 
**criticalTValue** | **Number** | Example: 1.646 | 
**confidenceInterval** | **Number** | Example: 1.4269359716898 | 
**experimentStartTime** | **Number** | Example: 1464937200 | 
**experimentEndTime** | **Number** | Example: 1501722000 | 
**userId** | **Number** | Example: 230 | 
**studyResults** | **String** | Example: This analysis suggests that higher Barometric Pressure (Environment) generally predicts higher Reference And Learning Hours (p &#x3D; 0).  Reference And Learning Hours is, on average, 0.84%  higher after around 101187.2 Barometric Pressure.  After an onset delay of 168 hours, Reference And Learning Hours is, on average, 82.6%  lower than its average over the 168 hours following around 97597.75 Barometric Pressure.  297 data points were used in this analysis.  The value for Barometric Pressure changed 287 times, effectively running 144 separate natural experiments.  The top quartile outcome values are preceded by an average 101187.2 Pa of Barometric Pressure.  The bottom quartile outcome values are preceded by an average 97597.75 Pa of Barometric Pressure.  Forward Pearson Correlation Coefficient was 0.147 (p&#x3D;0, 95% CI -1.28 to 1.574 onset delay &#x3D; 0 hours, duration of action &#x3D; 168 hours) .  The Reverse Pearson Correlation Coefficient was 0 (P&#x3D;0, 95% CI -1.427 to 1.427, onset delay &#x3D; -0 hours, duration of action &#x3D; -168 hours). When the Barometric Pressure value is closer to 101187.2 Pa than 97597.75 Pa, the Reference And Learning Hours value which follows is, on average, 0.84%  percent higher than its typical value.  When the Barometric Pressure value is closer to 97597.75 Pa than 101187.2 Pa, the Reference And Learning Hours value which follows is 0% lower than its typical value.  Reference And Learning Hours is 8.5h (1% higher) on average after days with around 101627.85 Pa Barometric Pressure  Reference And Learning Hours is 1.47h (83% lower) on average after days with around 21023.36 Pa Barometric Pressure | 
**dataAnalysis** | **String** | Example: It was assumed that 0 hours would pass before a change in Barometric Pressure would produce an observable change in Reference And Learning Hours.  It was assumed that Barometric Pressure could produce an observable change in Reference And Learning Hours for as much as 7 days after the stimulus event.   | 
**outcomeMaximumAllowedValue** | **String** | Example:  | 
**predictorMaximumAllowedValue** | **String** | Example:  | 
**studyLimitations** | **String** | Example: As with any human experiment, it was impossible to control for all potentially confounding variables.                           Correlation does not necessarily imply correlation.  We can never know for sure if one factor is definitely the cause of an outcome.               However, lack of correlation definitely implies the lack of a causal relationship.  Hence, we can with great              confidence rule out non-existent relationships. For instance, if we discover no relationship between mood             and an antidepressant this information is just as or even more valuable than the discovery that there is a relationship.              &lt;br&gt;             &lt;br&gt;                         We can also take advantage of several characteristics of time series data from many subjects  to infer the likelihood of a causal relationship if we do find a correlational relationship.              The criteria for causation are a group of minimal conditions necessary to provide adequate evidence of a causal relationship between an incidence and a possible consequence.             The list of the criteria is as follows:             &lt;br&gt;             1. Strength (effect size): A small association does not mean that there is not a causal effect, though the larger the association, the more likely that it is causal.             &lt;br&gt;             2. Consistency (reproducibility): Consistent findings observed by different persons in different places with different samples strengthens the likelihood of an effect.             &lt;br&gt;             3. Specificity: Causation is likely if a very specific population at a specific site and disease with no other likely explanation. The more specific an association between a factor and an effect is, the bigger the probability of a causal relationship.             &lt;br&gt;             4. Temporality: The effect has to occur after the cause (and if there is an expected delay between the cause and expected effect, then the effect must occur after that delay).             &lt;br&gt;             5. Biological gradient: Greater exposure should generally lead to greater incidence of the effect. However, in some cases, the mere presence of the factor can trigger the effect. In other cases, an inverse proportion is observed: greater exposure leads to lower incidence.             &lt;br&gt;             6. Plausibility: A plausible mechanism between cause and effect is helpful.             &lt;br&gt;             7. Coherence: Coherence between epidemiological and laboratory findings increases the likelihood of an effect.             &lt;br&gt;             8. Experiment: \&quot;Occasionally it is possible to appeal to experimental evidence\&quot;.             &lt;br&gt;             9. Analogy: The effect of similar factors may be considered.             &lt;br&gt;             &lt;br&gt;                            The confidence in a causal relationship is bolstered by the fact that time-precedence was taken into account in all calculations. Furthermore, in accordance with the law of large numbers (LLN), the predictive power and accuracy of these results will continually grow over time.  297 paired data points were used in this analysis.   Assuming that the relationship is merely coincidental, as the participant independently modifies their Barometric Pressure values, the observed strength of the relationship will decline until it is below the threshold of significance.  To it another way, in the case that we do find a spurious correlation, suggesting that banana intake improves mood for instance,             one will likely increase their banana intake.  Due to the fact that this correlation is spurious, it is unlikely             that you will see a continued and persistent corresponding increase in mood.  So over time, the spurious correlation will             naturally dissipate.Furthermore, it will be very enlightening to aggregate this data with the data from other participants  with similar genetic, diseasomic, environmentomic, and demographic profiles. | 
**significantDifference** | **Boolean** | Example: true | 
**significanceExplanation** | **String** | Example: Using a two-tailed t-test with alpha &#x3D; 0.05, it was determined that the change in Reference And Learning Hours is statistically significant at 95% confidence interval.  | 
**strengthLevel** | **String** | Example: very weak | 
**confidenceLevel** | **String** | Example: high | 
**studyObjective** | **String** | Example: The objective of this study is to determine the nature of the relationship (if any) between the Barometric Pressure and the Reference And Learning Hours. Additionally, we attempt to determine the Barometric Pressure values most likely to produce optimal Reference And Learning Hours values.  | 
**studyTitle** | **String** | Example: N1 Study: Barometric Pressure Predicts Higher Reference And Learning Hours | 
**dataSources** | **String** | Example: Barometric Pressure data was primarily collected using &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt;.  &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt; is a Chrome extension, Android app, iOS app, and web app that allows you to easily track mood, symptoms, or any outcome you want to optimize in a fraction of a second.  You can also import your data from over 30 other apps and devices like Fitbit, Rescuetime, Jawbone Up, Withings, Facebook, Github, Google Calendar, Runkeeper, MoodPanda, Slice, Google Fit, and more.  &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt; then analyzes your data to identify which hidden factors are most likely to be influencing your mood or symptoms and their optimal daily values.&lt;br&gt;Reference And Learning Hours data was primarily collected using &lt;a href&#x3D;\&quot;https://www.rescuetime.com/rp/quantimodo/plans\&quot;&gt;RescueTime&lt;/a&gt;.  Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs. | 
**studyAbstract** | **String** | Example: Your data suggests with a high degree of confidence (p&#x3D;0) that Barometric Pressure (Environment) has a weakly positive predictive relationship (R&#x3D;0.147) with Reference And Learning Hours  (Activity).  The highest quartile of Reference And Learning Hours  measurements were observed following an average 101187.2Pa Barometric Pressure.  The lowest quartile of Reference And Learning Hours  measurements were observed following an average 97597.75Pa Barometric Pressure. | 
**direction** | **String** | Example: higher | 
**predictivePearsonCorrelation** | **String** | Example:  | 
**predictorExplanation** | **String** | Example: Barometric Pressure Predicts Higher Reference And Learning Hours | 
**studyBackground** | **String** | Example:  | 
**studyDesign** | **String** | Example: This study is based on data donated by one QuantiModo user. Thus, the study design is consistent with an n&#x3D;1 observational natural experiment.  | 
**dataPoints** | **String** | Example:  | 
**numberOfDays** | **Number** | Example: 425 | 
**reversePairsCount** | **String** | Example:  | 
**causeChangesStatisticalSignificance** | **Number** | Example: 0.9999299755903 | 
**causeVariableCategoryId** | **Number** | Example: 17 | 
**effectVariableCategoryId** | **Number** | Example: 14 | 
**predictorFillingValue** | **String** | Example:  | 
**outcomeFillingValue** | **String** | Example:  | 
**causeNumberOfRawMeasurements** | **Number** | Example: 14764 | 
**effectNumberOfRawMeasurements** | **Number** | Example: 4045 | 
**causeNumberOfProcessedDailyMeasurements** | **Number** | Example: 1364 | 
**effectNumberOfProcessedDailyMeasurements** | **Number** | Example: 145 | 
**causeVariableMostCommonConnectorId** | **Number** | Example: 13 | 
**effectVariableMostCommonConnectorId** | **Number** | Example: 11 | 
**studyLinkFacebook** | **String** | Example: https://www.facebook.com/sharer/sharer.php?u&#x3D;https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fstudy%3FcauseVariableName%3DBarometric%2520Pressure%26effectVariableName%3DReference%2520And%2520Learning%2520Hours%26userId%3D230 | 
**studyLinkTwitter** | **String** | Example: https://twitter.com/home?status&#x3D;Barometric%20Pressure%20Predicts%20Higher%20Reference%20And%20Learning%20Hours%20https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fstudy%3FcauseVariableName%3DBarometric%2520Pressure%26effectVariableName%3DReference%2520And%2520Learning%2520Hours%26userId%3D230%20%40quantimodo | 
**studyLinkGoogle** | **String** | Example: https://plus.google.com/share?url&#x3D;https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fstudy%3FcauseVariableName%3DBarometric%2520Pressure%26effectVariableName%3DReference%2520And%2520Learning%2520Hours%26userId%3D230 | 
**causeVariableName** | **String** | Example: Barometric Pressure | 
**effectVariableName** | **String** | Example: Reference And Learning Hours | 
**averageEffect** | **Number** | Example: 8.4268686868687 | 
**numberOfLowEffectPairs** | **Number** | Example: 57 | 
**numberOfHighEffectPairs** | **Number** | Example: 27 | 
**degreesOfFreedom** | **Number** | Example: 200 | 
**numberOfUniqueCauseValuesForOptimalValues** | **Number** | Example: 201 | 
**numberOfUniqueEffectValuesForOptimalValues** | **Number** | Example: 264 | 
**numberOfCauseChangesForOptimalValues** | **Number** | Example: 287 | 
**medianOfUpperHalfOfEffectMeasurements** | **String** | Example:  | 
**medianOfLowerHalfOfEffectMeasurements** | **String** | Example:  | 
**numberOfEffectChangesForOptimalValues** | **Number** | Example: 295 | 
**minimumEffectValue** | **Number** | Example: 0.18 | 
**maximumEffectValue** | **Number** | Example: 20.38 | 
**effectValueSpread** | **Number** | Example: 20.2 | 
**minimumCauseValue** | **Number** | Example: 5267.5521276596 | 
**maximumCauseValue** | **Number** | Example: 104300 | 
**causeValueSpread** | **Number** | Example: 99032.44787234 | 
**averageEffectFollowingHighCause** | **Number** | Example: 8.5 | 
**averageEffectFollowingLowCause** | **Number** | Example: 1.47 | 
**averageDailyLowCause** | **Number** | Example: 21023.36 | 
**averageDailyHighCause** | **Number** | Example: 101627.85 | 
**principalInvestigator** | **String** | Example:  | 
**causeVariableCombinationOperation** | **String** | Example:  | 
**valuePredictingHighOutcomeExplanation** | **String** | Example: Reference And Learning Hours, on average, 0.84% higher after around 101187.2 Pa Barometric Pressure  | 
**averageEffectFollowingHighCauseExplanation** | **String** | Example: Reference And Learning Hours is 8.5h (1% higher) on average after days with around 101627.85 Pa Barometric Pressure | 
**averageEffectFollowingLowCauseExplanation** | **String** | Example: Reference And Learning Hours is 1.47h (83% lower) on average after days with around 21023.36 Pa Barometric Pressure | 
**valuePredictingLowOutcomeExplanation** | **String** | Example: Reference And Learning Hours, on average, 82.6% lower after around 97597.75 Pa Barometric Pressure  | 
**numberOfUsers** | **String** | Example:  | 
**outcomeDataSources** | **String** | Example:  | 
**correlationIsContradictoryToOptimalValues** | **Boolean** | Example: false | 
**forwardSpearmanCorrelationCoefficient** | **Number** | Example: -0.26193208156295 | 
**minimumProbability** | **Number** | Example: 0.05 | 
**strongestPearsonCorrelationCoefficient** | **String** | Example:  | 
**pairsOverTimeChartConfig** | **Date** | Example:  | 
**correlationsOverOnsetDelaysChartConfig** | **String** | Example:  | 
**correlationsOverDurationsOfActionChartConfig** | **String** | Example:  | 
**onsetDelayWithStrongestPearsonCorrelation** | **String** | Example:  | 
**averageForwardPearsonCorrelationOverOnsetDelays** | **String** | Example:  | 
**averageReversePearsonCorrelationOverOnsetDelays** | **String** | Example:  | 
**pearsonCorrelationWithNoOnsetDelay** | **String** | Example:  | 
**voteStatisticalSignificance** | **Number** | Example: 1 | 
**calculationStartTime** | **Date** | Example:  | 
**shareUserMeasurements** | **Boolean** | Example: false | 
**causeUserVariableShareUserMeasurements** | **String** | Example:  | 
**effectUserVariableShareUserMeasurements** | **String** | Example:  | 
**averagePearsonCorrelationCoefficientOverOnsetDelays** | **String** | Example:  | 
**onsetDelayWithStrongestPearsonCorrelationInHours** | **String** | Example:  | 
**causeVariableId** | **Number** | Example: 96380 | 
**effectVariableId** | **Number** | Example: 111642 | 
**studyLinkStatic** | **String** | Example: https://local.quantimo.do/api/v2/study?causeVariableName&#x3D;Barometric%20Pressure&amp;effectVariableName&#x3D;Reference%20And%20Learning%20Hours&amp;userId&#x3D;230 | 
**studyLinkDynamic** | **String** | Example: https://local.quantimo.do/ionic/Modo/www/index.html#/app/study?causeVariableName&#x3D;Barometric%20Pressure&amp;effectVariableName&#x3D;Reference%20And%20Learning%20Hours&amp;userId&#x3D;230 | 
**gaugeImage** | **String** | Example: https://s3.amazonaws.com/quantimodo-docs/images/gauge-weakly-positive-relationship.png | 
**imageUrl** | **String** | Example: https://s3-us-west-1.amazonaws.com/qmimages/variable_categories_gauges_logo_background/gauge-weakly-positive-relationship_environment_activity_logo_background.png | 
**gaugeImageSquare** | **String** | Example: https://s3.amazonaws.com/quantimodo-docs/images/gauge-weakly-positive-relationship-200-200.png | 
**onsetDelayInHours** | **Number** | Example: 0 | 
**durationOfActionInHours** | **Number** | Example: 0 | 
**effectVariableDefaultUnitId** | **Number** | Example: 34 | 
**causeVariableDefaultUnitName** | **String** | Example:  | 
**causeVariableDefaultUnitAbbreviatedName** | **String** | Example: Pa | 
**effectVariableDefaultUnitName** | **String** | Example:  | 
**effectVariableDefaultUnitAbbreviatedName** | **String** | Example: h | 
**rawCauseMeasurementSignificance** | **Number** | Example: 1 | 
**allPairsSignificance** | **Number** | Example: 0.99994982531794 | 
**numberOfDaysSignificance** | **Number** | Example: 0.99999929612614 | 
**rawEffectMeasurementSignificance** | **Number** | Example: 1 | 
**optimalChangeSpread** | **Number** | Example: 83.44 | 
**optimalChangeSpreadSignificance** | **Number** | Example: 0.99999999999917 | 
**correlationsOverDurationsOfAction** | **String** | Example:  | 
**dataSourcesParagraphForEffect** | **String** | Example: Reference And Learning Hours data was primarily collected using &lt;a href&#x3D;\&quot;https://www.rescuetime.com/rp/quantimodo/plans\&quot;&gt;RescueTime&lt;/a&gt;.  Detailed reports show which applications and websites you spent time on. Activities are automatically grouped into pre-defined categories with built-in productivity scores covering thousands of websites and applications. You can customize categories and productivity scores to meet your needs. | 
**dataSourcesParagraphForCause** | **String** | Example: Barometric Pressure data was primarily collected using &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt;.  &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt; is a Chrome extension, Android app, iOS app, and web app that allows you to easily track mood, symptoms, or any outcome you want to optimize in a fraction of a second.  You can also import your data from over 30 other apps and devices like Fitbit, Rescuetime, Jawbone Up, Withings, Facebook, Github, Google Calendar, Runkeeper, MoodPanda, Slice, Google Fit, and more.  &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt; then analyzes your data to identify which hidden factors are most likely to be influencing your mood or symptoms and their optimal daily values. | 
**instructionsForEffect** | **String** | Example: &lt;a href&#x3D;\&quot;https://www.rescuetime.com/rp/quantimodo/plans\&quot;&gt;Obtain RescueTime&lt;/a&gt; and use it to record your Reference And Learning Hours. Once you have a &lt;a href&#x3D;\&quot;https://www.rescuetime.com/rp/quantimodo/plans\&quot;&gt;RescueTime&lt;/a&gt; account, &lt;a href&#x3D;\&quot;https://app.quantimo.do/ionic/Modo/www/#/app/import\&quot;&gt;connect your  RescueTime account at QuantiModo&lt;/a&gt; to automatically import and analyze your data. | 
**instructionsForCause** | **String** | Example: &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;Obtain QuantiModo&lt;/a&gt; and use it to record your Barometric Pressure. Once you have a &lt;a href&#x3D;\&quot;https://quantimo.do\&quot;&gt;QuantiModo&lt;/a&gt; account, &lt;a href&#x3D;\&quot;https://app.quantimo.do/ionic/Modo/www/#/app/import\&quot;&gt;connect your  QuantiModo account at QuantiModo&lt;/a&gt; to automatically import and analyze your data. | 
**perDaySentenceFragment** | **String** | Example:  | 
**predictsLowEffectChangeSentenceFragment** | **String** | Example: , on average, 82.6%  | 
**predictsHighEffectChangeSentenceFragment** | **String** | Example: , on average, 0.84%  | 
**studyLinkEmail** | **String** | Example: mailto:?subject&#x3D;N1%20Study%3A%20Barometric%20Pressure%20Predicts%20Higher%20Reference%20And%20Learning%20Hours&amp;body&#x3D;Check%20out%20my%20study%20at%20https%3A%2F%2Flocal.quantimo.do%2Fapi%2Fv2%2Fstudy%3FcauseVariableName%3DBarometric%2520Pressure%26effectVariableName%3DReference%2520And%2520Learning%2520Hours%26userId%3D230%0A%0AHave%20a%20great%20day! | 
**distanceFromMiddleToBeHightLowEffect** | **Number** | Example: 25 | 
**numberOfSamples** | **Number** | Example: 297 | 
**effectUnit** | **String** | Example: h | 
**causeVariableImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Weather/chance_of_storm-96.png | 
**causeVariableIonIcon** | **String** | Example: ion-ios-partlysunny | 
**effectVariableImageUrl** | **String** | Example: https://maxcdn.icons8.com/Color/PNG/96/Sports/football-96.png | 
**effectVariableIonIcon** | **String** | Example: ion-ios-body-outline | 



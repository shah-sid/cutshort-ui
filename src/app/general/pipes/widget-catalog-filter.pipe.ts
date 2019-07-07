import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Widget } from 'app/models/widget';

@Pipe({
    name: 'filterWidgetsCatalog'
})
export class WidgetCatalogFilterPipe implements PipeTransform {

    constructor() { }

    transform(widgets: Widget[], searchTerms?: any) {
        if (widgets && widgets.length == 0) {
            return widgets;
        } else if (searchTerms && searchTerms.length == 0) {
            return widgets;
        } else {
            // console.log("List of widgets: ", widgets);
            // console.log("Search terms: ", searchTerms);
            /** Search for individual search terms, and place result at the same index position */
            const IndividualResult = [];
            for (let i = 0; i < searchTerms.length; i++) {
                const searchText = searchTerms[i].toLowerCase();

                IndividualResult[i] = []
                for (const widget of widgets) {
                    /** tagsToSearchFrom is an array containing Widget's devID, devName, devTypeName and tags */
                    let tagsToSearchFrom = [];
                    tagsToSearchFrom = tagsToSearchFrom.map(function(x) { return x.toLowerCase() });
                    tagsToSearchFrom.push((widget.title).toLowerCase());
                    tagsToSearchFrom.push(widget.description.toLowerCase());
                    tagsToSearchFrom.push(widget.type.toLowerCase());

                    /** If search text is a substring of any element of the array, then push that element as result */
                    if (_.some(tagsToSearchFrom, _.method('includes', searchText))) {
                        IndividualResult[i].push(widget);
                    }

                    // console.log("Tags to search from :", tagsToSearchFrom, "Search text: ", searchText);
                    // console.log("Individual result", i, IndividualResult);
                }
            }

            /** Take intersection of all the individual results to get result of all search terms applied at once */
            let resultArray = [];
            if (IndividualResult.length > 1) {
                /** Sort result in ascending order of their lengths */
                IndividualResult.sort(function(a, b) {
                    return a.length - b.length;
                });

                /** Find intersection of each 2 consecutive arrays */
                for (let i = 0; i < IndividualResult.length - 1; i++) {
                    const array1 = IndividualResult[i];
                    const array2 = IndividualResult[i + 1];

                    /** For next iteration search in the intersection */
                    IndividualResult[i + 1] = _.intersection(array1, array2);
                }
                /** Final result is at the last position */
                resultArray = IndividualResult[IndividualResult.length - 1];
            } else {
                /** If only single search term, first result is the final result */
                resultArray = IndividualResult[0];
            }
           return resultArray;
        }
    }
}

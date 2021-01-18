class Filter {
    /**
     * @param map filter map with all dependencies
     * @param appliedOptions lists of checked filter options
     */
    constructor(map, appliedOptions) {
        this.map = map;
        this.appliedOptions = appliedOptions;
        this.buildState(map, appliedOptions)
    }

    /**
     * @param map filter map with all dependencies
     * @returns initial state of filters in interface like style
     * {
     *    crops: [{ "name":"crop_id1",  "disable":false, "checked": false }],
     *    groups: [{ "name":"group_id1", "disable":false, "checked": false }],
     *    access: [{ "name":"pro", "disable":false, "checked": false }],
     *    years: [{ "name":"2020", "disable":false, "checked": false }] 
     * }
     */
    buildInitialState(map) {
        return Object.keys(map.crops).reduce((accum, cropItemKey) => {
            const cropItem = map.crops[cropItemKey];

            accum.crops.push({
                name: cropItemKey,
                disable: false,
                checked: false
            });

            Object.keys(map.crops[cropItemKey]).forEach(category => {
                cropItem[category].forEach(filterItem => {
                    if (!accum[category].find(item => item.name === filterItem)) {
                        accum[category].push({
                            name: filterItem,
                            disable: false,
                            checked: false
                        });
                    }                 
                });
            });

            return accum;
        }, {crops: [], groups: [], years: [], access: []})
    }

   /**
    * buildState method build interface state with all dependecies and checked options
    * @param map filter map with all dependencies
    * @param applied lists of checked filter options
    * @returns initial state of filters with checked options in interface like style
    * {
    *    crops: [{ "name":"crop_id1",  "disable":false, "checked": false }],
    *    groups: [{ "name":"group_id1", "disable":false, "checked": false }],
    *    access: [{ "name":"pro", "disable":false, "checked": false }],
    *    years: [{ "name":"2020", "disable":false, "checked": false }] 
    * }
    */
    buildState(map, appliedOptions) {
        const stateWithoutCheckedFilters = this.buildInitialState(map);
        const stateWithCheckedOptions = this.markCheckedOptions(stateWithoutCheckedFilters, appliedOptions);

        // пройти по примененным фильтрам
        Object.keys(appliedOptions).forEach(appliedOptionsKey => {
            const appliedOptionsList = appliedOptions[appliedOptionsKey];

            // если в категории примененного фильтра что-то есть
            if (appliedOptionsList.length) {
                // пройти по категории
                appliedOptionsList.forEach(appliedOptionsListItem => {
                    // и это категория не crops
                    if (appliedOptionsKey !== 'crops') {                    
                        // пройти по категории кропы карты фильтров
                        Object.keys(map.crops).forEach(cropName => {
                            // если в категории кропы карты фильтров нет примененного фильтра
                            if (map.crops[cropName][appliedOptionsKey].indexOf(appliedOptionsListItem) === -1) {
                                // записать в стейт интерфейса для данного кропа - disable: true
                                const stateCropItem = stateWithCheckedOptions.crops.find(item => {
                                    return item.name === cropName;
                                });

                                stateCropItem.disable = true;
                            }
                        });
                    // если категория crops     
                    } else {
                    // пройти по карте фильтров и найти нужную категорию
                        Object.keys(map).forEach(category => {
                            if (category !== 'crops') {
                                // пройти по категории
                                Object.keys(map[category]).forEach(categoryItem => {
                                    if (map[category][categoryItem].length) {
                                        // если нет примененного фильтра по кропу
                                        if (map[category][categoryItem].indexOf(appliedOptionsListItem) === -1) {
                                            const stateItem = stateWithCheckedOptions[category].find(item => {
                                                return item.name === categoryItem;
                                            });

                                            stateItem.disable = true;
                                        }
                                    }
                                });
                            }
                        });
                    } 
                });          
            }            
        });

        console.log(stateWithCheckedOptions);
        return stateWithCheckedOptions;
    }    

    /**
     * markCheckedOptions add to interface state marked options
     * @param state interfaces like type
     */
    markCheckedOptions(state, appliedOptions) {
        Object.keys(state).forEach(stateKey => {
            const stateList = state[stateKey];

            stateList.forEach(stateItem => {
                if (appliedOptions[stateKey].indexOf(stateItem.name) != -1) {
                    stateItem.checked = true;
                }
            });
        });

        return state;
    }
}

new Filter(filterMap, filterApply);
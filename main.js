class Filter {
    #state;

    /**
     * @param map filter map with all dependencies
     * @param appliedOptions lists of checked filter options
     */
    constructor(map, appliedOptions) {
        this.map = map;
        this.appliedOptions = appliedOptions;
        this.#buildState(map, appliedOptions);
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
    #buildInitialState(map) {
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
     * buildState method build interface state with all dependecies and checked options recusive way
     * @param map filter map with all dependencies
     * @param applied lists of checked filter options
     * @returns initial state of filters with checked options in interface like style
     */
    #buildState(map, appliedOptions) {
        const stateWithoutCheckedFilters = this.#buildInitialState(map);
        this.#state = this.#markCheckedOptions(stateWithoutCheckedFilters, appliedOptions);

        Object.keys(appliedOptions).forEach(category => {
            const appliedOptionsCategoryList = appliedOptions[category];

            appliedOptionsCategoryList.forEach(appliedOptionsListItem => {
                this.applyFilter(appliedOptionsListItem, category);
            });
        });
    }

    /**
     * markCheckedOptions add to interface state marked options
     * @param state interfaces like type
     */
    #markCheckedOptions(state, appliedOptions) {
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

    applyFilter(appliedOptionsListItem, category) {
        if (category !== 'crops') {
            // пройти по категории кропы карты фильтров
            Object.keys(this.map.crops).forEach(cropName => {
                // если в категории кропы карты фильтров нет примененного фильтра
                if (this.map.crops[cropName][category].indexOf(appliedOptionsListItem) === -1) {
                    // записать в стейт интерфейса для данного кропа - disable: true
                    const stateCropItem = this.#state.crops.find(item => {
                        return item.name === cropName;
                    });

                    if (!stateCropItem.disable) {
                        stateCropItem.disable = true;
                    }
                }
            });
        } else {
            Object.keys(this.map).forEach(category => {
                if (category !== 'crops') {
                    // пройти по категории
                    Object.keys(this.map[category]).forEach(categoryItem => {
                        // если нет примененного фильтра по кропу
                        if (this.map[category][categoryItem].indexOf(appliedOptionsListItem) === -1) {
                            // ищем в стейте интерфейса нужную оцию
                            const stateItem = this.#state[category].find(item => {
                                return item.name === categoryItem;
                            });

                            if (!stateItem.disable) {
                                stateItem.disable = true;
                            }
                        }
                    });
                }
            });
        } 
    }

    getState() {
        return this.#state;
    }
}

const filter = new Filter(filterMap, filterApply);
filter.applyFilter('crop_id3', 'crops');
console.log(filter.getState());
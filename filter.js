class Filter {
    #state;

    /**
     * @param map filter map with all dependencies
     * @param appliedOptions lists of checked filter options
     */
    constructor(map, appliedOptions) {
        this.map = map;
        this.appliedOptions = appliedOptions ? appliedOptions : {crops: [], groups: [], years: [], access: []};
        this.#buildState();
    }

    /**
     * buildState method build interface state with all dependecies and checked options recusive way
     * @param map filter map with all dependencies
     * @param applied lists of checked filter options
     * @returns initial state of filters with checked options in interface like style
     */
    #buildState() {
        const stateWithoutCheckedFilters = this.#buildInitialState();
        this.#state = this.#markCheckedOptions(stateWithoutCheckedFilters, this.appliedOptions);

        Object.keys(this.appliedOptions).forEach(category => {
            const appliedOptionsCategoryList = this.appliedOptions[category];

            appliedOptionsCategoryList.forEach(appliedOptionsListItem => {
                this.#applyFilter(appliedOptionsListItem, category);
            });
        });
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
    #buildInitialState() {
        return Object.keys(this.map.crops).reduce((accum, cropItemKey) => {
            const cropItem = this.map.crops[cropItemKey];

            accum.crops.push({
                name: cropItemKey,
                disable: false,
                checked: false
            });

            Object.keys(this.map.crops[cropItemKey]).forEach(category => {
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

    #applyFilter(filterItem, category) {
        if (category !== 'crops') {
            // пройти по категории кропы карты фильтров
            Object.keys(this.map.crops).forEach(cropName => {
                // если в категории кропы карты фильтров нет примененного фильтра
                if (this.map.crops[cropName][category].indexOf(filterItem) === -1) {
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
                        if (this.map[category][categoryItem].indexOf(filterItem) === -1) {
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

    clickByFilterItem(filterName, category) {
        const index = this.appliedOptions[category].indexOf(filterName)
        const isEnable = index === -1;

        isEnable ? this.appliedOptions[category].push(filterName) : this.appliedOptions[category].splice(index, 1);
        this.#buildState();
    }
}
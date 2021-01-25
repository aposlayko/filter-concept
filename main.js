function it(message, func) {
    if (func()) {
        console.log(`%c ${message} - success`, 'color: green');
    } else {
        console.log(`%c ${message} - fail`, 'color: red');
    }
}


it('Correct length of state options', () => {
    const filter = new Filter(filterMap);
    const state = filter.getState();

    return Object.keys(state).every(category => {
        if(category === 'access' && state[category].length === 2) {
            return true;
        } else if (category === 'crops' && state[category].length === 4) {
            return true;
        } else if (category === 'groups' && state[category].length === 2) {
            return true;
        } else if (category === 'years' && state[category].length === 3) {
            return true;
        } else {
            return false;
        }
    });
});

it('Correct state without applied filters', () => {
    const filter = new Filter(filterMap);
    const state = filter.getState();

    return Object.keys(state).every(category => {
        return state[category].every(filterItem => {
            return !filterItem.disable && !filterItem.checked;
        });
    });
});

it('Select filter which doesn\'t affect state', () => {
    const filter = new Filter(filterMap);
    filter.clickByFilterItem('2019', 'years');
    const state = filter.getState();

    const everyOptionEnabled = Object.keys(state).every(category => {
        return state[category].every(filterItem => {
            return !filterItem.disable;
        });
    });
    const targetOptionSelected = state.years[1].checked;

    return everyOptionEnabled && targetOptionSelected;
});

it('Select filter which affect state (disable one crop)', () => {
    const filter = new Filter(filterMap);
    filter.clickByFilterItem('2020', 'years');
    const state = filter.getState();

    const isCropOptionDisable = state.crops[0].disable;
    const targetOptionSelected = state.years[2].checked;

    return isCropOptionDisable && targetOptionSelected;
});

it('Select filter which disable two options (pro and 2018)', () => {
    const filter = new Filter(filterMap);
    filter.clickByFilterItem('crop_id3', 'crops');
    const state = filter.getState();

    const isYearOptionDisable = state.years.every(yearItem => yearItem.name === '2018' ? yearItem.disable : !yearItem.disable);
    const isAccessOptionDisable = state.access.every(accessItem => accessItem.name === 'pro' ? accessItem.disable : !accessItem.disable);
    const targetOptionSelected = state.crops[2].checked;

    return isYearOptionDisable && isAccessOptionDisable && targetOptionSelected;
});

it('Select filter which disable 3 options (crops)', () => {
    const filter = new Filter(filterMap);
    filter.clickByFilterItem('2018', 'years');
    const state = filter.getState();

    const isCropsOptionsDisabled = state.crops.every(cropItem => cropItem.name === 'crop_id1' ? !cropItem.disable : cropItem.disable);
    const targetOptionSelected = state.years[0].checked;

    return isCropsOptionsDisabled && targetOptionSelected;
});

it('Select 2 filters which disable all options (crops)', () => {
    const filter = new Filter(filterMap);
    filter.clickByFilterItem('2018', 'years');
    filter.clickByFilterItem('2020', 'years');
    const state = filter.getState();

    const isCropsOptionsDisabled = state.crops.every(cropItem => cropItem.disable);
    const targetOptionsSelected = state.years[0].checked && state.years[2].checked;

    return isCropsOptionsDisabled && targetOptionsSelected;
});

it('Select all available options (shouldn\'t disable already selected filter)', () => {
    const filter = new Filter(filterMap);
    filter.clickByFilterItem('2020', 'years');
    filter.clickByFilterItem('2019', 'years');
    filter.clickByFilterItem('crop_id2', 'crops');
    filter.clickByFilterItem('crop_id4', 'crops');    
    filter.clickByFilterItem('crop_id3', 'crops');
    filter.clickByFilterItem('group_id1', 'groups');
    filter.clickByFilterItem('free', 'access');    
    const state = filter.getState();

    return Object.keys(state).every(category => {
        return state[category].every(filterItem => {
            return filterItem.disable !== filterItem.checked;
        });
    });
});
const filterMap = {
	years: {
		2020: {
			crops: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"]
		},
		2019: {
			crops: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"]
		},
		2018: {
			crops: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"]
		}
	},
	crops: {
		crop_id1: {
			groups: ["group_id1", "group_id2"],
            years: ["2018", "2019"],
            access: ['pro', 'free']
		},
		crop_id2: {
			groups: ["group_id1"],
            years: ["2018", "2019", "2020"],
            access: ['pro', 'free']
        },
        crop_id3: {
            groups: ["group_id1", "group_id2"],
            years: ["2018", "2019", "2020"],
            access: ['pro']
        },
        crop_id4: {
            groups: ["group_id1", "group_id2"],
            years: ["2018", "2019", "2020"],
            access: ['pro', 'free']
        }
	},
	groups: {
		group_id1: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"],
        group_id2: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"]
	},
    access: {
        pro: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"],
        free: ["crop_id1", "crop_id2", "crop_id3", "crop_id4"]
    }        
};

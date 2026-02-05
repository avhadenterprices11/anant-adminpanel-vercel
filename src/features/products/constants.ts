
// Category hierarchy (4-tier)
export const categoryHierarchy: Record<string, Record<string, Record<string, string[]>>> = {
    'Sports Equipment': {
        'Cricket': {
            'Bats': ['Bat 1', 'Bat 2'],
            'Balls': ['Ball 1', 'Ball 2'],
        },
        'Football': {
            'Balls': ['Ball 1', 'Ball 2'],
            'Shoes': ['Shoe 1', 'Shoe 2'],
        },
        'Badminton': {
            'Rackets': ['Racket 1', 'Racket 2'],
            'Shuttles': ['Shuttle 1', 'Shuttle 2'],
        },
        'Tennis': {
            'Rackets': ['Racket 1', 'Racket 2'],
            'Balls': ['Ball 1', 'Ball 2'],
        },
        'Basketball': {
            'Balls': ['Ball 1', 'Ball 2'],
            'Shoes': ['Shoe 1', 'Shoe 2'],
        },
    },
    'Fitness & Gym': {
        'Cardio Equipment': {
            'Treadmills': ['Treadmill 1', 'Treadmill 2'],
            'Ellipticals': ['Elliptical 1', 'Elliptical 2'],
        },
        'Strength Training': {
            'Dumbbells': ['Dumbbell 1', 'Dumbbell 2'],
            'Barbells': ['Barbell 1', 'Barbell 2'],
        },
        'Yoga & Pilates': {
            'Mats': ['Mat 1', 'Mat 2'],
            'Blocks': ['Block 1', 'Block 2'],
        },
        'Accessories': {
            'Water Bottles': ['Bottle 1', 'Bottle 2'],
            'Towels': ['Towel 1', 'Towel 2'],
        },
    },
    'Outdoor & Adventure': {
        'Camping': {
            'Tents': ['Tent 1', 'Tent 2'],
            'Sleeping Bags': ['Bag 1', 'Bag 2'],
        },
        'Hiking': {
            'Backpacks': ['Backpack 1', 'Backpack 2'],
            'Poles': ['Pole 1', 'Pole 2'],
        },
        'Cycling': {
            'Bikes': ['Bike 1', 'Bike 2'],
            'Helmets': ['Helmet 1', 'Helmet 2'],
        },
        'Water Sports': {
            'Boards': ['Board 1', 'Board 2'],
            'Wetsuits': ['Wetsuit 1', 'Wetsuit 2'],
        },
    },
    'Team Sports': {
        'Volleyball': {
            'Balls': ['Ball 1', 'Ball 2'],
            'Nets': ['Net 1', 'Net 2'],
        },
        'Hockey': {
            'Sticks': ['Stick 1', 'Stick 2'],
            'Pucks': ['Puck 1', 'Puck 2'],
        },
        'Rugby': {
            'Balls': ['Ball 1', 'Ball 2'],
            'Jerseys': ['Jersey 1', 'Jersey 2'],
        },
        'Baseball': {
            'Bats': ['Bat 1', 'Bat 2'],
            'Gloves': ['Glove 1', 'Glove 2'],
        },
    },
    'Accessories': {
        'Bags & Storage': {
            'Backpacks': ['Backpack 1', 'Backpack 2'],
            'Duffels': ['Duffel 1', 'Duffel 2'],
        },
        'Protection Gear': {
            'Helmets': ['Helmet 1', 'Helmet 2'],
            'Pads': ['Pad 1', 'Pad 2'],
        },
        'Apparel': {
            'T-Shirts': ['T-Shirt 1', 'T-Shirt 2'],
            'Jackets': ['Jacket 1', 'Jacket 2'],
        },
        'Footwear': {
            'Shoes': ['Shoe 1', 'Shoe 2'],
            'Boots': ['Boot 1', 'Boot 2'],
        },
    },
};

export const existingSizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];
export const existingAccessories = ['Helmet Protection Kit', 'Cleaning Set', 'Storage Bag'];
export const existingPickupLocations = ['Warehouse A - Delhi', 'Warehouse B - Mumbai', 'Warehouse C - Bangalore'];
export const salesChannelOptions = ['Web', 'POS', 'Marketplace', 'B2B'];

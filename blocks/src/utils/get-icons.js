/*
 * Icons
 */
async function wpOpusFetchIcons() {
    const iconsData = await wp.apiFetch({
        path: '/wpopus/v1/icons'
    });

    return Object.entries(iconsData).map(([label, value]) => ({
        index: label,  
        value 
    }));
  
}

export async function wpOpusGetCustomIcons() {
    try {
        const icons = await wpOpusFetchIcons();
        return icons;
    } catch (error) {
        return error.message; 
    }
}

export async function wpOpusGetCustomIcon( iconFileName  ) {
    try {
        const icon = await wp.apiFetch({
            path: '/wpopus/v1/icon/' + iconFileName 
        });
        return icon;
    } catch (error) {
        return error.message; 
    }
}

/*
 * Shape dividers
 */
async function wpOpusFetchShapeDividers() {
    const shapesData = await wp.apiFetch({
        path: '/wpopus/v1/shapedividers'
    });

    return Object.entries(shapesData).map(([label, value]) => ({
        index: label,  
        value 
    }));
  
}

export async function wpOpusGetShapeDividers() {
    try {
        const icons = await wpOpusFetchShapeDividers();
        return icons;
    } catch (error) {
        return error.message; 
    }
}

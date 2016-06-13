export function esriCustom512(urlTemplate) {
    if (urlTemplate) {
        return (tileCoord) => {
            return urlTemplate.replace('{z}', (tileCoord[0] - 1).toString())
                .replace('{x}', tileCoord[1].toString())
                .replace('{y}', (-tileCoord[2] - 1).toString());
        };
    }
    return undefined;
}

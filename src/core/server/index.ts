import * as alt from '@altv/server';

alt.Events.onPlayerConnect(({ player }) => {
    player.model = 'mp_m_freemode_01';
    player.spawn({ x: 36.19486618041992, y: 859.3850708007812, z: 197.71343994140625 }, 0);
});

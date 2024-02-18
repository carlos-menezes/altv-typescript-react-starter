import * as alt from '@altv/server';

const voice = alt.VoiceChannel.create({
    spatial: true,
    maxDistance: 15,
    priority: 0,
    filter: 0,
});

alt.Events.onPlayerConnect(({ player }) => {
    alt.log(`[${player.id}] ${player.name} has connected to the server.`);

    player.model = 'mp_m_freemode_01';
    player.spawn({ x: 36.19486618041992, y: 859.3850708007812, z: 197.71343994140625 }, 0);
    voice.addPlayer(player);
});

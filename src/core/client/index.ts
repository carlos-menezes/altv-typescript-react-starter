import * as alt from '@altv/client';
import { Enums } from '@altv/shared';

alt.Events.onConnectionComplete(() => {
    alt.log('Activation key:', alt.Voice.activationKey, alt.Voice.activationLevel);
});

alt.Events.onKeyDown(({ key }) => {
    if (key === Enums.KeyCode.N) {
        alt.Voice.toggleInput(true);
    }
});

alt.Events.onKeyUp(({ key }) => {
    if (key === Enums.KeyCode.N) {
        alt.Voice.toggleInput(false);
    }
});

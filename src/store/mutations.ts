import {
    GETIMAGEBLOB
} from './mutation-types'
export default {
    [GETIMAGEBLOB](state: any, data: any) {
        state.imageBlob = data
    },
}

import { Text } from '@/components/core'
import { GlassBox } from '@/components/glass-box'
import RankingShareModal from './ranking-share-modal'

export default function RankingProfileSection() {
    return (
        <GlassBox variant='glass-box' sx={{ p: 2 }}>
            <Text variant='h5' sx={{ textAlign: 'center' }}>
                Refer friends and earn!
            </Text>
            <RankingShareModal copyHighlight />
        </GlassBox>
    )
}

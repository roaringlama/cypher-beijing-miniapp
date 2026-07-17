import type { Activity, FeatureFlag, LevelConfig, UserProfile } from '../shared/types/domain'
import { defaultFeatureFlags } from '../services/feature-flag-service'

const now = '2026-07-15T10:00:00.000Z'

export const mockUsers: UserProfile[] = [
  {
    id: 'user_momo', nickname: 'MOMO', avatarUrl: '', dancerName: 'MOMO W.', district: '朝阳', primaryStyle: 'Popping',
    otherStyles: ['Hip-Hop'], styleTags: ['Funk', 'Boogaloo', 'Party Groove'], danceYears: 6, crew: 'DAYBREAK',
    bio: 'Keep it loose. Keep it honest.', instagram: 'momo.moves', douyin: 'MOMO在跳', instagramPublic: true,
    douyinPublic: false, crewPublic: true, points: 86, levelId: 'in-the-circle',
    stats: { completedActivities: 18, hostedActivities: 4, noShows: 0 }, badges: ['Reliable Groover', 'Early Circle'],
    createdAt: now, updatedAt: now,
  },
  {
    id: 'user_lolo', nickname: 'LOLO', avatarUrl: '', dancerName: 'LOLO', district: '东城', primaryStyle: 'Locking',
    otherStyles: ['Soul'], styleTags: ['Funk', 'Party'], danceYears: 9, crew: 'FUNKY PEKING', bio: 'Records, circles, good people.',
    instagramPublic: false, douyinPublic: false, crewPublic: true, points: 522, levelId: 'groove-keeper',
    stats: { completedActivities: 31, hostedActivities: 11, noShows: 0 }, badges: ['Groove Keeper'], createdAt: now, updatedAt: now,
  },
]

export const mockActivities: Activity[] = [
  {
    id: 'activity_funk_after_dark', type: 'cypher', organizerId: 'user_lolo', title: 'FUNK AFTER DARK',
    danceStyles: ['Popping', 'Locking'], styleTags: ['Funk', 'Boogaloo', 'All Level'],
    description: '一晚只放让身体想动的 Funk。没有赛制，没有裁判，轮到你就进圈。', musicDirection: '70s Funk · G-Funk · Talkbox',
    startsAt: '2026-07-18T19:30:00+08:00', endsAt: '2026-07-18T22:30:00+08:00', district: '东城',
    venueName: '鼓楼附近 · B1 Studio', address: '东城区鼓楼东大街虚构地址 18 号 B1', addressVisibility: 'approved_only',
    minParticipants: 8, maxParticipants: 24, participantCount: 17, beginnerFriendly: true, entryRequirements: 'Respect the circle. 带干净室内鞋。',
    filming: true, publishVideoAllowed: true, costNote: 'AA 场地费，预计 ¥35/人', joinMode: 'direct',
    notes: ['19:15 起可入场', '新手可先在外圈感受', '现场拍摄前会再次确认'], status: 'published', coverTone: 'acid', createdAt: now, updatedAt: now,
  },
  {
    id: 'activity_sunday_soul', type: 'cypher', organizerId: 'user_momo', title: 'SUNDAY SOUL KITCHEN',
    danceStyles: ['Hip-Hop', 'Locking'], styleTags: ['Soul', 'Warm-up', 'Beginner Friendly'],
    description: '星期日下午的小圈，慢慢热开，听歌、交换 groove。', musicDirection: 'Soul · Rare Groove · 90s Hip-Hop',
    startsAt: '2026-07-19T15:00:00+08:00', endsAt: '2026-07-19T18:00:00+08:00', district: '朝阳',
    venueName: '十里堡 · Rooftop Room', address: '朝阳区十里堡虚构路 9 号', addressVisibility: 'public', minParticipants: 6,
    maxParticipants: 16, participantCount: 9, beginnerFriendly: true, entryRequirements: '不限舞龄。', filming: false,
    publishVideoAllowed: false, costNote: '免费', joinMode: 'approval', notes: ['自带水杯'], status: 'published', coverTone: 'tangerine', createdAt: now, updatedAt: now,
  },
  {
    id: 'activity_wax_works', type: 'cypher', organizerId: 'user_lolo', title: 'WAX WORKS SESSION',
    danceStyles: ['Popping'], styleTags: ['Animation', 'Waving'], description: '小规模音乐实验。', musicDirection: 'Electro · Instrumental Funk',
    startsAt: '2026-07-22T20:00:00+08:00', endsAt: '2026-07-22T22:00:00+08:00', district: '海淀', venueName: '五道口 · Room 404',
    address: '海淀区虚构街 404 号', addressVisibility: 'approved_only', minParticipants: 5, maxParticipants: 12, participantCount: 11,
    beginnerFriendly: false, entryRequirements: '有基础 freestyle 经验。', filming: true, publishVideoAllowed: false, costNote: '¥40/人', joinMode: 'approval',
    notes: ['名额较少'], status: 'published', coverTone: 'ice', createdAt: now, updatedAt: now,
  },
]

export const mockLevels: LevelConfig[] = [
  { id: 'feel-the-beat', code: 'LV1', name: 'Feel the Beat', minPoints: 0, maxPoints: 9, badge: 'BEAT', enabled: true },
  { id: 'step-in', code: 'LV2', name: 'Step In', minPoints: 10, maxPoints: 49, badge: 'STEP', enabled: true },
  { id: 'in-the-circle', code: 'LV3', name: 'In the Circle', minPoints: 50, maxPoints: 99, badge: 'CIRCLE', enabled: true },
  { id: 'groove-keeper', code: 'LV4', name: 'Groove Keeper', minPoints: 100, maxPoints: 199, badge: 'GROOVE', enabled: true },
  { id: 'scene-builder', code: 'LV5', name: 'Scene Builder', minPoints: 200, badge: 'SCENE', enabled: true },
]
export const mockFeatureFlags: readonly FeatureFlag[] = defaultFeatureFlags

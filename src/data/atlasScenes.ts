export type SeasonFilter = 'All' | 'Spring' | 'Summer' | 'Autumn' | 'Dry season' | 'Late winter'

export type AtlasScene = {
  id: string
  place: string
  placeZh: string
  country: string
  countryZh: string
  season: SeasonFilter
  seasonLabel: string
  seasonLabelZh: string
  subtitle: string
  storyTitle: string
  storyLine: string
  latitude: number
  longitude: number
  videoSrc: string
  poster: string
  posterTime: number
  captionSubtitle: string
  segmentStart?: number
  segmentEnd?: number
  tags: string[]
  accent: string
  chapter: string
}

const montage = '/atlas/atlas-montage-clean.mp4'

export const atlasScenes: AtlasScene[] = [
  {
    id: 'la-pampa', place: 'La Pampa', placeZh: '潘帕斯草原', country: 'Argentina', countryZh: '阿根廷', season: 'Spring', seasonLabel: 'Spring', seasonLabelZh: '春季',
    subtitle: 'Open grassland, river and a quiet crossing.', storyTitle: '草原从河流边展开', storyLine: '春天的潘帕斯，河流把道路和牧场分成缓慢的格子。', latitude: -36.801, longitude: -63.998,
    videoSrc: '/atlas/la-pampa.mp4', poster: '/atlas/posters/la-pampa.jpg', posterTime: 8, captionSubtitle: 'Spring · open grassland',
    tags: ['river', 'road', 'grassland'], accent: '#7b9968', chapter: '01',
  },
  {
    id: 'niigata', place: 'Niigata', placeZh: '新潟水田', country: 'Japan', countryZh: '日本', season: 'Spring', seasonLabel: 'Spring', seasonLabelZh: '春季',
    subtitle: 'Sakura over flooded paddies in a blue grid.', storyTitle: '樱花落在水田上', storyLine: '融雪灌满新潟水田，樱花沿着田埂亮起来。', latitude: 37.996, longitude: 139.381,
    videoSrc: '/atlas/niigata.mp4', poster: '/atlas/posters/niigata.jpg', posterTime: 8, captionSubtitle: 'Spring · sakura over flooded paddies',
    tags: ['paddies', 'blossoms', 'river'], accent: '#c27b8c', chapter: '02',
  },
  {
    id: 'allgau', place: 'Allgäu', placeZh: '阿尔高山谷', country: 'Bavaria', countryZh: '德国巴伐利亚', season: 'Autumn', seasonLabel: 'Autumn', seasonLabelZh: '秋季',
    subtitle: 'Cows down from the Alps, under a soft autumn light.', storyTitle: '牛群下山以后', storyLine: '秋天把阿尔高的山坡染成暖色，牛群沿桥回到谷地。', latitude: 47.672, longitude: 10.392,
    videoSrc: '/atlas/allgau.mp4', poster: '/atlas/posters/allgau.jpg', posterTime: 8, captionSubtitle: 'Autumn · cows down from the alps',
    tags: ['animals', 'bridge', 'forest'], accent: '#c18c50', chapter: '03',
  },
  {
    id: 'serengeti', place: 'Serengeti', placeZh: '塞伦盖蒂草原', country: 'Tanzania', countryZh: '坦桑尼亚', season: 'Dry season', seasonLabel: 'Dry season', seasonLabelZh: '旱季',
    subtitle: 'Long grass, a small lake and the slow geometry of heat.', storyTitle: '热季的草与水', storyLine: '旱季里，长草围住一小片水面，动物沿着水边移动。', latitude: -2.501, longitude: 35.102,
    videoSrc: '/atlas/serengeti.mp4', poster: '/atlas/posters/serengeti.jpg', posterTime: 8, captionSubtitle: 'Dry season · long grass',
    tags: ['animals', 'lake', 'long grass'], accent: '#c49352', chapter: '04',
  },
  {
    id: 'punjab-main', place: 'Punjab', placeZh: '旁遮普田野', country: 'India', countryZh: '印度', season: 'Late winter', seasonLabel: 'Late winter', seasonLabelZh: '冬末',
    subtitle: 'Mustard in flower, roads and water in long perspective.', storyTitle: '芥末花开的冬末', storyLine: '冬末的旁遮普，金色芥末田与笔直道路一起延伸。', latitude: 30.879, longitude: 76.198,
    videoSrc: '/atlas/punjab.mp4', poster: '/atlas/posters/punjab.jpg', posterTime: 8, captionSubtitle: 'Late winter · mustard in flower',
    tags: ['mustard', 'road', 'fields'], accent: '#d3a646', chapter: '05',
  },
  {
    id: 'lapland', place: 'Lapland', placeZh: '拉普兰山地', country: 'Finland', countryZh: '芬兰', season: 'Summer', seasonLabel: 'Summer', seasonLabelZh: '夏季',
    subtitle: 'Midnight sun on the fells, seen between river and road.', storyTitle: '午夜阳光下的山丘', storyLine: '拉普兰的夏夜没有真正落幕，河流在午夜阳光里绕过山丘。', latitude: 67.161, longitude: 26.866,
    videoSrc: montage, poster: '/atlas/posters/lapland.jpg', posterTime: 5, captionSubtitle: 'Summer · midnight sun on the fells', segmentStart: 0, segmentEnd: 13.5,
    tags: ['midnight sun', 'river', 'fells'], accent: '#73966d', chapter: '06A',
  },
  {
    id: 'punjab-alt', place: 'Punjab', placeZh: '旁遮普南线', country: 'India', countryZh: '印度', season: 'Late winter', seasonLabel: 'Late winter', seasonLabelZh: '冬末',
    subtitle: 'A second pass over mustard fields, with the flight line turning south.', storyTitle: '黄花田的第二次掠过', storyLine: '航线转向南方，花田、道路和云影交替经过。', latitude: 30.695, longitude: 76.099,
    videoSrc: montage, poster: '/atlas/posters/punjab-alt.jpg', posterTime: 20, captionSubtitle: 'Late winter · mustard in flower', segmentStart: 13.5, segmentEnd: 29,
    tags: ['mustard', 'clouds', 'fields'], accent: '#d3a646', chapter: '06B',
  },
  {
    id: 'normandy', place: 'Normandy', placeZh: '诺曼底牧场', country: 'France', countryZh: '法国', season: 'Spring', seasonLabel: 'Spring', seasonLabelZh: '春季',
    subtitle: 'Apple blossom and new grass, threaded by a blue river.', storyTitle: '苹果花打开春天', storyLine: '诺曼底的苹果花与新草同时醒来，蓝色河流穿过牧场。', latitude: 49.006, longitude: 0.091,
    videoSrc: montage, poster: '/atlas/posters/normandy.jpg', posterTime: 34, captionSubtitle: 'Spring · apple blossom and new grass', segmentStart: 29, segmentEnd: 40.13,
    tags: ['blossoms', 'river', 'meadows'], accent: '#6c977c', chapter: '06C',
  },
]

export const seasonFilters: SeasonFilter[] = ['All', 'Spring', 'Summer', 'Autumn', 'Dry season', 'Late winter']

export const findScene = (id: string) => atlasScenes.find((scene) => scene.id === id) ?? atlasScenes[0]

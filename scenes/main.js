const MOVE_SPEED = 120
const FLY_FORCE = 100
const HEAVY_FLY_FORCE = -100
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
const ENEMY_SPEED = 40
const FALL_DEATH = 1000

let CURRENT_ENEMY_SPEED = ENEMY_SPEED
let CURRENT_FLY_FORCE = FLY_FORCE
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true

layers(['obj', 'ui'], 'obj')

const maps = [[
  '                                       ',
  '                                       ',
  '                                       ',
  '                                       ',
  '                                       ',
  '                                       ',
  '                                       ',
  '      %   =*=%=                        ',
  '                                       ',
  '                                     -+',
  '     e        s                      ()',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
], [
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e             @7@@@     @@@*@@         e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e  @@7@7                               e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                                      e',
  'e                          s           e',
  'e                         sss          e',
  'e           @*@7@%       sssss         e',
  'e                       sssssss        e',
  'e                      sssssssss     -+e',
  'e                   ! sssssssssss    ()e',
  'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
  ],[
    'e                     zzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz@zzzzzzzz',
    'e                                                                               @       z',
    'e                                                                               @    @`@z',
    'e                                                                               @       z',
    'e                                                                               @=~=    z',
    'e                                                                               @       z',
    'e                                                                   sss7s7ss    @       z',
    'e                                                                          s            z',
    'e                                                         z~z8z~z~z~z      s            z',
    'e                                                                          s====@=====  z',
    'e                                       zzzz%zz%z                               @       z',
    'e                                                                               @       z',
    'e                                                                               @       z',
    'e                        e  ! !  s                                              @       z',
    'e                        ====*====                                              @       z',
    'e                                                                               @ %  -+ z',
    'e                                                                               @    () z',
    'e        =%=*=%==`=``=                                                 e   !!   ssxxxxxxx',
    'e                                                               e  ^^  sssxxxxxxxxxxxxxxx',
    'e                                                     e    !    ssxxxxxxxxxxxxxxxxxxxxxxx',
    'e    !            ^                  ^           !    ssxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ],
    [
      'e  sssssssssssssssssssssss',
      'e  x             z       s',
      'e  x             z     -+s',
      'e  xe      s     z     ()s',
      'e  x%7%7%7%7     z  zzzzzs',
      'e  x             z  zzzzzs',
      'e  x             z  zzzzzs',
      'e  x                     s',
      'e  x         e           s',
      'e  x         z~`~`~`~`~`~s',
      'e  x                     s',
      'e  x                     s',
      'e  xe                    s',
      'e  xxx`x`x`x`x`x         s',
      'e  x                     s',
      'e  x                     s',
      'e  x         e          ss',
      'e  x         z`%8~%7%%z~zs',
      'e  x                     s',
      'e  x                     s',
      'e  xe          s         s',
      'e  xxx`x~x`x~x`x         s',
      'e  x                     s',
      'e  x                     s',
      'e  x         e  !  !  !  s',
      'e  x         zz7z7z7z%z7zs',
      'e  x                     s',
      'e  x                     s',
      'e  xe  ^ ^  ^  s         s',
      'e  xx7xxx*x7x7xx         s',
      'e  x                     s',
      'e  x                     s',
      'e           e   ^  ! ^   s',
      'e           zzzzz~z%z`zzzs',
      'e  `                     s',
      'e                        s',
      'e !      !      !     !  s',
      'e=@=@=@=@=@=@=@=@=@=@=@=@s',                   
    ]
]

const levelCfg = {
  width: 20,
  height: 20,
  '=' : [sprite('block'), solid()],
  'x' : [sprite('brick'), solid(), 'floor'],
  '$' : [sprite('coin'), 'coin'],
  '%' : [sprite('question'), 'coin-surprise', solid()],
  '*' : [sprite('question'), 'mushroom-surprise', solid()], 
  '`' : [sprite('question'), '1dangerous-surprise', solid()], 
  '}' : [sprite('unboxed'), solid()],
  '(' : [sprite('pipe-left'), scale(0.5), solid()],
  ')' : [sprite('pipe-right'), scale(0.5)],
  '-' : [sprite('pipe-top-left-side'), scale(0.5), solid(), 'pipe'],
  '+' : [sprite('pipe-top-right-side'), scale(0.5), solid(), 'pipe'],
  '^' : [sprite('evil-shroom-1'), solid(), 'dangerous', body()],
  '#' : [sprite('mushroom'), 'mushroom', body(), scale(1.5)],
  'z' : [sprite('blue-block'), scale(0.5), solid()],
  '@' : [sprite('blue-brick'), solid(), scale(0.5)],
  '!' : [sprite('blue-evil-shroom'), 'dangerous', scale(1.5), solid(), body()],
  's' : [sprite('blue-steel'), solid(), scale(0.5), 'steelR'],
  'e' : [sprite('blue-steel'), solid(), scale(0.5), 'steelL'],
  '7' : [sprite('blue-surprise'), 'coin-surprise', solid(), scale(0.5)],
  '8' : [sprite('blue-surprise'), 'mushroom-surprise', solid(), scale(0.5)],
  '~' : [sprite('blue-surprise'), '2dangerous-surprise', solid(), scale(0.5)],
}

const levelIndex = args.level ?? 0

const gameLevel = addLevel(maps[levelIndex], levelCfg)
//const gameLevel = addLevel(maps[3], levelCfg)

const scoreGlobal = args.score ?? 0
add([
  text('Instructions:'),
  pos(20,35)
])
add([
  text('1. Press right -> key to move right'),
  pos(20,50)
])
add([
  text('2. Press left <- key to move left'),
  pos(20,65)
])
add([
  text('^'),
  pos(116,74)
])
add([
  text('3. Press up | key to jump'),
  pos(20,80)
])
add([
  text('4. Press up key + Hold space bar ___ key to fly'),
  pos(20,95)
])
add([
  text('5. Jump on enimies to kill'),
  pos(20,110)
])
add([
  text('6. Head Bump on surprise boxes'),
  pos(20,125)
])

const scoreLable = add([
  text("Score: " + scoreGlobal),
  pos(30,6),
  layer('ui'),
  {
    value: scoreGlobal,
  }
])

add([text('Level ' + parseInt(levelIndex + 1)), pos(30, 20)])

function rage(){
  let timer = 0
  let isRage = false
  return{
    update(){
      if (isRage){
        timer -=dt()
        if (timer <=0){
          this.smallify()
        }
      }
    },
    isRage(){
      return isRage
    },
    smallify(){
      this.scale = vec2(1)
      timer = 0
      isRage = false
      CURRENT_JUMP_FORCE = JUMP_FORCE
      CURRENT_FLY_FORCE = FLY_FORCE
    },
      raged(time){
      this.scale = vec2(5)
      timer = time
      isRage = true
      CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
      CURRENT_FLY_FORCE = HEAVY_FLY_FORCE
    }
  }
}

const player = add([
  sprite('iron-man-standing'),
  'iron-man-standing',
  pos(30,0),
  body(),
  rage(),
  origin('bot')
])

//const playerFlying = ([
//  sprite('iron-man-flying'),
//  'iron-man-flying',
//  pos('iron-man-standing'),
//  body(),
//  rage(),
//  scale(1),
//  origin('bot')
//])

//const playerRaged = ([
//  sprite('iron-man-rage'),
//  'iron-man-rage',
//  pos('iron-man-standing'),
//  scale(3),
//  body(),
//  rage(),
//  origin('bot')
//])


player.collides('dangerous', (d) => {
  if(isJumping){
     scoreLable.value++
    scoreLable.text = scoreLable.value
    destroy(d)
  }else{
    go('lose', {score: scoreLable.value})
  }
})

player.action(() => {
  camPos(player.pos)
  if(player.pos.y >= FALL_DEATH){
    go('lose', {score: scoreLable.value})
  }
})

keyDown('left', () => {
  player.move(-MOVE_SPEED,0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED,0)
})

keyDown('space', () => {
  if(!player.grounded()){
    player.jump(CURRENT_FLY_FORCE)
  }
})

keyRelease('space', () => {
  
})

function fly (p){
  const obj = add([
    sprite('iron-man-flying'), pos(p), 'fly'
  ])
  wait(0.10, () => {
    destroy(obj)
  })
}

player.action(() => {
  if(player.grounded()){
    isJumping = false
  }
})

keyPress('up', () => {
  if(player.grounded()){
    isJumping = true
  player.jump(CURRENT_JUMP_FORCE)
  }
})

player.on('headbump', (obj) => {
  if(obj.is('coin-surprise')){
    gameLevel.spawn('$', obj.gridPos.sub(0,1))
    destroy(obj)
    gameLevel.spawn('}', obj.gridPos.sub(0,0))
  }
  if(obj.is('mushroom-surprise')){
    gameLevel.spawn('#', obj.gridPos.sub(0,1))
    destroy(obj)
    gameLevel.spawn('}', obj.gridPos.sub(0,0))
  }
  if(obj.is('1dangerous-surprise')){
    gameLevel.spawn('!', obj.gridPos.sub(0,1))
    destroy(obj)
    gameLevel.spawn('}', obj.gridPos.sub(0,0))
  }
  if(obj.is('2dangerous-surprise')){
    gameLevel.spawn('^', obj.gridPos.sub(0,1))
    destroy(obj)
    gameLevel.spawn('}', obj.gridPos.sub(0,0))
  }
})

action('mushroom', (m) => {
  m.move(20, 0)
})

player.collides('mushroom', (m) => {
  player.raged(10)
  destroy(m)
})

player.collides('coin', (c) => {
  scoreLable.value++
  scoreLable.text = scoreLable.value
  destroy(c)
})

action('dangerous', (d) => {
  d.move(-CURRENT_ENEMY_SPEED,0)
})

collides('dangerous', 'steelR', () => {
  CURRENT_ENEMY_SPEED = ENEMY_SPEED
})

collides('dangerous', 'steelL', () => {
  CURRENT_ENEMY_SPEED = -ENEMY_SPEED
})

player.collides('pipe', () => {
  keyPress('down', () => {
    go('main', {
      level: (levelIndex + 1) % maps.length,
      score: scoreLable.value
    })
  })
})
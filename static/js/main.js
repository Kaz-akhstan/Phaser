class projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');
    }

    fire(x, y, angle) {
        let speed = 1000;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(speed * Math.sin(angle));
        this.setVelocityX(speed * Math.cos(angle));

        //this.projectile.rotation(angle + Math.PI/2);        //FIXME
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class projectileGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: projectile,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'projectile'
        })
    }

    fireProjectile(x, y, angle) {
        const projectile = this.getFirstDead(false);
        if (projectile) {
            projectile.fire(x, y, angle);
        }
    }
}

class collectible extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'collectible');
    }

    spawnOBJ(x, y) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
    }
}

class collectibleGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene)

        this.createMultiple({
            classType: collectible,
            active: false,
            visible: false,
            key: 'collectible'
        })
    }

    spawnCollectible(x, y) {
        collectible.spawnOBJ(x, y);                 //FIXME
        //console.log(x, y)
    }
}

class firstScene extends Phaser.Scene {
    constructor() {
        super();

        this.player = null;

        this.keyA;
        this.keyD;
        this.keyW;
        this.keyS;

        this.rX = 0;
        this.rY = 0;

        this.speed = 200;
        this.t = 100;
        this.countdown = undefined;
    }

    preload() {
        this.load.image('projectile', '/static/assets/projectile.png');
        this.load.image('player', '/static/assets/player.png');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1D1923);
        this.projectileGroup = new projectileGroup(this);
        this.collectibleGroup = new collectibleGroup(this);
        this.addPlayer();
        this.addEvents();
        this.addTimeEvent();

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    addTimeEvent() {
        this.countdown = this.time.delayedCall(this.t, this.timeEvent, [], this);
    }

    timeEvent() {
        this.spawnCollectible();
        this.addTimeEvent();
    }

    spawnCollectible() {
        this.rX = Math.floor(Math.random() * this.sys.game.canvas.width)
        this.rY = Math.floor(Math.random() * this.sys.game.canvas.height)
        this.collectibleGroup.spawnCollectible(this.rX, this.rY)
    }

    addEvents() {
        let angle;
        this.input.on('pointermove', pointer => {
            angle = Phaser.Math.Angle.BetweenPoints(this.player, pointer);
            this.player.rotation = angle + Math.PI / 2;
        });

        this.input.on('pointerdown', pointer => {
            this.shootProjectile(angle);
        });
    }

    shootProjectile(angle) {
        this.projectileGroup.fireProjectile(this.player.x, this.player.y, angle);
    }

    addPlayer() {
        const X = this.cameras.main.width / 2;
        const Y = this.cameras.main.height - 90;
        this.player = this.physics.add.sprite(X, Y, 'player')
    }

    update() {


        if (this.keyA.isDown) {
            this.player.setVelocityX(-this.speed);
        }
        else if (this.keyD.isDown) {
            this.player.setVelocityX(this.speed);
        }
        else {
            this.player.setVelocityX(0);
        }

        if (this.keyW.isDown) {
            this.player.setVelocityY(-this.speed);
        }
        else if (this.keyS.isDown) {
            this.player.setVelocityY(this.speed);
        }
        else {
            this.player.setVelocityY(0);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: firstScene
};

const game = new Phaser.Game(config);
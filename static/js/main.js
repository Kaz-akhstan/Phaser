class projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y)
    {
        super(scene, x, y, 'projectile');
    }

    fire(x, y, angle)
    {
        let speed = 1000;
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(speed*Math.sin(angle));
        this.setVelocityX(speed*Math.cos(angle));
        this.projectile.rotation(angle + Math.PI/2);        //FIXME
    }

    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);
        if(this.y <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class projectileGroup extends Phaser.Physics.Arcade.Group
{
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

    fireProjectile(x, y, angle)
    {
        const projectile = this.getFirstDead(false);
        if(projectile)
        {
            projectile.fire(x, y, angle);
        }
    }
}

class firstScene extends Phaser.Scene
{
	constructor() {
		super();

        this.player;
	}

	preload() {
		this.load.image('projectile', '/static/assets/projectile.png');
		this.load.image('player', '/static/assets/player.png');
	}

	create() {
		this.cameras.main.setBackgroundColor(0x1D1923);
        this.projectileGroup = new projectileGroup(this);
        this.addPlayer();
        this.addEvents();
	}

    addEvents()
    {
        let angle;
        this.input.on('pointermove', pointer => {
            angle = Phaser.Math.Angle.BetweenPoints(this.player, pointer);
            this.player.rotation = angle + Math.PI/2;
        });

        this.input.on('pointerdown', pointer => {
            this.shootProjectile(angle);
        });
    }

    shootProjectile(angle)
    {
        this.projectileGroup.fireProjectile(this.player.x, this.player.y, angle);
    }

    addPlayer()
    {
        const X = this.cameras.main.width/2;
        const Y = this.cameras.main.height-90;
        this.player = this.add.image(X, Y, 'player');
    }

	update() {
        
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
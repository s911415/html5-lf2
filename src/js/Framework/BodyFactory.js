var Framework = (function (Framework) {
    Framework.BodyFactory = function () {
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2Fixture = Box2D.Dynamics.b2Fixture
            , b2World = Box2D.Dynamics.b2World
            , b2MassData = Box2D.Collision.Shapes.b2MassData
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ;

        this.bodyType_Dynamic = Box2D.Dynamics.b2Body.b2_dynamicBody;
        this.bodyType_Static = Box2D.Dynamics.b2Body.b2_staticBody;
        this.b2Vec2 = b2Vec2;

        var options = {density: 1, friction: 0.5};
        this.world = null;

        this.createWorld = function (options) {
            options = options || {};
            options.gravityY = options.gravityY || 10;
            options.gravityX = options.gravityX || 0;

            if (typeof options.allowSleep === 'undefined') {
                options.allowSleep = true;
            }

            this.world = new b2World(new b2Vec2(options.gravityX, options.gravityY), options.allowSleep);

            return this.world;
        };

        //var squareBody= Framework.BodyFatory.createSquareBody (w, h, bodyType,options);
        this.createSquareBody = function (width, height, bodyType, options) {
            var fixDef = new b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;

            var bodyDef = new b2BodyDef;

            //create ground
            bodyDef.type = bodyType;
            bodyDef.position.x = 0;
            bodyDef.position.y = 0;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(width, height);
            var squareBody = this.world.CreateBody(bodyDef);
            var squareFixture = squareBody.CreateFixture(fixDef);

            return squareBody;
        };

        //var squareBody= Framework.BodyFatory.createCircleBody (r, bodyType,options);
        this.createCircleBody = function (radius, bodyType, options) {
            var fixDef = new b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;

            var bodyDef = new b2BodyDef;

            //create ground
            bodyDef.type = bodyType;
            bodyDef.position.x = 0;
            bodyDef.position.y = 0;
            fixDef.shape = new b2CircleShape(radius);
            var circleBody = this.world.CreateBody(bodyDef);
            var circleFixture = circleBody.CreateFixture(fixDef);

            return circleBody;
        };


    };
    return Framework;
})(Framework || {});
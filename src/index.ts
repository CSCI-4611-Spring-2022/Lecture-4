/* Lecture 4
 * CSCI 4611, Spring 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as paper from 'paper';

class Game 
{
    // Width and height are defined in project coordinates
    // This is different than screen coordinates!
    private width : number;
    private height : number;

    // Exclamation points tell TypeScript that the variables won't be
    // null even though they aren't initialized in the constructor
    private bee! : paper.Group;
    private line! : paper.Path.Line;

    private velocity : paper.Point;
    
    constructor()
    {
        // Setup graphics
        this.width = 1200;
        this.height = 800;
        paper.setup('canvas');
        this.resize();

        this.velocity = new paper.Point(0, 0);
    }

    start() : void 
    {
        // Setup scene
        this.createScene();
    
        // This registers the event handlers for window and mouse events
        paper.view.onResize = () => {this.resize();};
        paper.view.onMouseMove = (event: paper.MouseEvent) => {this.onMouseMove(event)};
        paper.view.onMouseDown = (event: paper.MouseEvent) => {this.onMouseDown(event)};
        paper.view.onMouseUp = (event: paper.MouseEvent) => {this.onMouseUp(event)};
        paper.view.onFrame = (event: GameEvent) => {this.update(event)};
    }

    private createScene() : void 
    {
        // Setting applyMatrix to false is important
        // This allows you to manipulate the transform like a scene graph at runtime
        // Otherwise it will just propagate the transform to its children instantaneously
        this.bee = new paper.Group();
        this.bee.applyMatrix = false;
        this.bee.position.x = 200;
        this.bee.position.y = this.height - 250;

        paper.project.importSVG('./assets/bee.svg', (item: paper.Item) => {
            item.scale(-4, 4);
            item.addTo(this.bee);
        });

        var groundGeometry = new paper.Rectangle(0, 0, this.width*4, paper.view.size.height);
        var ground = new paper.Path.Rectangle(groundGeometry);
        ground.bounds.x = -this.width / 2;
        ground.bounds.y = this.height - 50;
        ground.fillColor = new paper.Color('green');

        this.line = new paper.Path.Line(new paper.Point(0, 0), new paper.Point(1, 0));
        this.line.applyMatrix = false;
        this.line.strokeColor = new paper.Color('black');
        this.line.strokeWidth = 2;
        this.line.pivot = new paper.Point(0, 0);
        this.line.sendToBack();
        this.line.visible = false;
    }

    // This method will be called once per frame
    private update(event: GameEvent) : void
    {
        if(this.velocity.length > 0)
        {
            // Velocity change due to gravity is 9.8 meters per second
            // We multiply by an arbitrary scale factor to tune the strength of gravity
            const gravity = 9.8 * 3;
            this.velocity.y = this.velocity.y + gravity;
            this.bee.translate(this.velocity.multiply(event.delta));

            // Reset the bee when it falls off the screen
            // Remember that the origin is at the top left corner!
            if(this.bee.position.y >= this.height)
            {
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.bee.position.x = 200;
                this.bee.position.y = this.height - 250;
            }
        }
    }

    private onMouseMove(event: paper.MouseEvent) : void
    {
        // If the line is visible, update it
        if(this.line.visible)
        {
            this.line.position = this.bee.position;

            var mouseVector = event.point.subtract(this.bee.position);
            this.line.scaling.x = mouseVector.length;
            this.line.rotation = mouseVector.angle;
            this.bee.rotation = mouseVector.angle + 180;
        }    
    }

    private onMouseDown(event: paper.MouseEvent) : void
    {
        // If the bee is not already moving, then do a hit test
        // to see if the user is clicking on it
        if(this.velocity.length == 0)
        {
            var hitResult = this.bee.hitTestAll(event.point);
            if(hitResult.length > 0)
            {
                this.line.visible = true;
            }
        }
    }  

    private onMouseUp(event: paper.MouseEvent) : void
    {
        // When the user releases the mouse button and the line is visible
        // then send the bee flying
        if(this.line.visible)
        {
            var mouseVector = event.point.subtract(this.bee.position);
            this.velocity.x = mouseVector.length * 10; // modify this constant to tune the gameplay
            this.velocity.y = 0;
            this.velocity = this.velocity.rotate(this.bee.rotation, new paper.Point(0, 0));
            
            this.line.visible = false;
        }
        
    }  

    // This handles dynamic resizing of the browser window
    // You do not need to modify this function
    private resize() : void
    {
        var aspectRatio = this.width / this.height;
        var newAspectRatio = paper.view.viewSize.width / paper.view.viewSize.height;

        // using <, the view will be resized to fit within the window
        // using >, thhe view will be resized to fill the width of the window, 
        // and the portions top and bottom may be cut off
        if(newAspectRatio < aspectRatio)
            paper.view.zoom = paper.view.viewSize.width  / this.width;  
        else
            paper.view.zoom = paper.view.viewSize.height / this.height;
        
        paper.view.center = new paper.Point(this.width / 2, this.height / 2);
    }  
}

// This is included because the paper is missing a TypeScript definition
// You do not need to modify it
class GameEvent
{
    readonly delta: number;
    readonly time: number;
    readonly count: number;

    constructor()
    {
        this.delta = 0;
        this.time = 0;
        this.count = 0;
    }
}
    
// Start the game
var game = new Game();
game.start();
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
    
    constructor()
    {
        // Setup graphics
        this.width = 1200;
        this.height = 800;
        paper.setup('canvas');
        this.resize();
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
        paper.project.importSVG('./assets/bee.svg', (item: paper.Item) => {
            item.position.x = 200;
            item.position.y = this.height - 250;
            item.scale(-4, 4);
        });

        var groundGeometry = new paper.Rectangle(0, 0, this.width*4, paper.view.size.height);
        var ground = new paper.Path.Rectangle(groundGeometry);
        ground.bounds.x = -this.width / 2;
        ground.bounds.y = this.height - 50;
        ground.fillColor = new paper.Color('green');
    }

    // This method will be called once per frame
    private update(event: GameEvent) : void
    {

    }

    private onMouseMove(event: paper.MouseEvent) : void
    {

    }

    private onMouseDown(event: paper.MouseEvent) : void
    {

    }  

    private onMouseUp(event: paper.MouseEvent) : void
    {

        
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
window.onload = function() {

    //MAIN CANVAS OBJECT
    var Canvas = {
        canvasElem: document.getElementById("canvas"),
        setCanvasSize: function() {
            this.canvasElem.setAttribute("width", window.innerWidth);
            this.canvasElem.setAttribute("height", window.innerHeight);            
        }
    }    
    Canvas.setCanvasSize();

    // CHECK WEBGL CONTEXT
    function checkContext() {
        try {
            if ( !window.WebGLRenderingContext || !Canvas.canvasElem.getContext( 'webgl' ) || !Canvas.canvasElem.getContext( 'experimental-webgl' ) ) {
                throw new Error();
            }
        } catch( e ) { 
            document.getElementsByClassName("disable-webGL")[0].classList.remove("hiden"); 
            console.log(12);
            return false;   
        }
    }

    var checkerContext = checkContext() || true;
    if (!checkerContext) return;

    //RENDERER
    var renderer = new THREE.WebGLRenderer({canvas: Canvas.canvasElem});

    // SCENE
    var scene = new THREE.Scene();

    // CAMERA
    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1300 );
    camera.position.set(0, 0, 80);
  
    // LIGHT
    var staticLightRight = new THREE.DirectionalLight(0x93EC8B, .9);
    var staticLightLeft = new THREE.DirectionalLight(0xEC4F86, 1.9);
    staticLightRight.position.set( 50, 50, 10 );
    staticLightLeft.position.set( -50, 50, 10 );

    var flyingLight = new THREE.PointLight(0xffffff, 5, 30, 2);
    var flyingLight2 = new THREE.PointLight(0xffffff, 5, 30, 2);
    flyingLight.position.set( 0, 25, 5);
    flyingLight2.position.set( 0, 25, 5);

    var ambLight = new THREE.AmbientLight( 0xffffff,  .5 );

    scene.add( flyingLight, flyingLight2, staticLightRight, staticLightLeft, ambLight );

    // LOADERS
    var textureLoader = new THREE.TextureLoader();
    var objLoader = new THREE.OBJLoader();
    var fontLoader = new THREE.FontLoader();

    // SKYSPHERE
    textureLoader.load("./textures/tunnel.jpg", function(texture) {
        var skySphere = new THREE.SphereGeometry(120, 12, 12); 
        var skyMaterial = new THREE.MeshPhongMaterial({ map: texture });
        var sky = new THREE.Mesh(skySphere, skyMaterial);
        sky.material.side = THREE.BackSide;
        scene.add(sky);
    });


    var sharks = [];

    var imageReturner = function(img) {return img}
    var loadShark = function() {
            var sharkDiffuse =  textureLoader.load('obj/shark/body.jpg', imageReturner);  
            var sharkTeeth =  textureLoader.load('obj/shark/teeth.jpg', imageReturner);  
            var sharkEyes =  textureLoader.load('obj/shark/eyes_diffuse.jpg', imageReturner);  
            var bumpMap =  textureLoader.load('textures/noiseBumpMap.jpg', imageReturner);  

            objLoader.load( 'obj/shark/Great_white.obj', function ( object ) {
                
                object.children[0].material.map = sharkTeeth;
                object.children[1].material.map = sharkEyes;
                object.children[2].material.map = sharkDiffuse;
                object.children[2].material.bumpMap = bumpMap;
                object.children[2].material.bumpScale = .005;

                object.scale.set(.1, .1, .1);

                var leftShark = object.clone();
                leftShark.position.set(-40,0,0); 

                var rightShark = object.clone();
                rightShark.position.set(40,0,0); 

                sharks.push( object, leftShark, rightShark );
                scene.add( object, leftShark, rightShark );
                
                // WAIT FOR LOADING SHARKS
                var loading = document.getElementsByClassName("loading")[0];
                loading.classList.add("hide");
                setTimeout( function() {
                    loading.classList.add("hiden");
                }, 2000);

            }, null, function() {console.log("err")} );
          
    }

    loadShark();
    var text = null;
    // TEXT
    fontLoader.load( 'fonts/gentilis_bold.typeface.json', function ( font ) {

	var geometry = new THREE.TextGeometry( 'Welcome on shark sync!', {
		font: font,
		size: 5,
		height: 1,
		curveSegments: 12
	} );
    var material = new THREE.MeshPhongMaterial({color: 0x5C112A});
    var text = new THREE.Mesh(geometry, material);
    text.position.set(-35, 20, 0);
    scene.add( text );
} );

    // ICO
    var Igeometry = new THREE.IcosahedronBufferGeometry(5, 1);
    var Iwireframe = new THREE.WireframeGeometry( Igeometry );

    var Imaterial = new THREE.LineBasicMaterial({
        color: 0x03FFC3,
        depthTest: false,
        opacity: .4,
        transparent: true
    });

    var line = new THREE.LineSegments( Iwireframe, Imaterial );

    line.position.y = -22;
    
    scene.add( line );

    // CONTROLS
    var controls = new THREE.TrackballControls(camera, Canvas.canvasElem);
    controls.minDistance = 20;
    controls.maxDistance = 160;
    
    // DRUG THE ICO
    var drag = new DragObj(scene, camera, controls, line);
  
    Canvas.canvasElem.addEventListener('mousedown', drag.onDocumentMouseDown.bind(drag), false);
    Canvas.canvasElem.addEventListener('touchstart', drag.onDocumentMouseDown.bind(drag), false);

    Canvas.canvasElem.addEventListener('mousemove', drag.onDocumentMouseMove.bind(drag), false);
    Canvas.canvasElem.addEventListener('touchmove', drag.onDocumentMouseMove.bind(drag), false);

    Canvas.canvasElem.addEventListener('mouseup', drag.onDocumentMouseUp.bind(drag), false);
    Canvas.canvasElem.addEventListener('touchend', drag.onDocumentMouseUp.bind(drag), false);

    // WATCH FOR CANVAS 100% SIZE
    window.addEventListener("resize", function(){
        Canvas.setCanvasSize.bind(Canvas);
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    var t = 6.28;
    // UPDATE FRAME
    var animate = function() {
        requestAnimationFrame(animate);
        controls.update();
        t -= 0.015; 
        sharks.forEach(function(shark) {
            shark.rotation.y -= 0.01;
            shark.rotation.x -= 0.01;
            shark.rotation.z -= 0.01;

        });
        
        flyingLight.position.x = 35*Math.cos(t);
        flyingLight2.position.x = -35*Math.cos(t);
        if ( t < 0) t = 6.28;
        renderer.render(scene, camera);
    }

    animate();
}

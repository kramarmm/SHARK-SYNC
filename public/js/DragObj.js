function DragObj(scene, camera, controls, object) {
    
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.object = object;

    this.raycaster = new THREE.Raycaster();
    this.selection = null;
    this.offset = new THREE.Vector3();

    this.objectColorToggle = new ColorToggle( this.object );

    // Plane, that helps to determinate an intersection position
    this.plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(500, 500, 8, 8),
        new THREE.MeshLambertMaterial({opacity: 0, transparent: true})
        );
    this.scene.add(this.plane);

}

    DragObj.prototype.onDocumentMouseDown = function (e) {
        this.mouse = new THREE.Vector2();
        // Get mouse position
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Set the raycaster position
        this.raycaster.setFromCamera( this.mouse, this.camera );
        // Find all intersected objects
        this.intersects = this.raycaster.intersectObject( this.object );

        if (this.intersects.length > 0) {
        // Disable the controls
        this.controls.enabled = false;
        this.objectColorToggle.on();
        // Set the selection - first intersected object
        this.selection = this.intersects[0].object;
        // Calculate the offset
        this.intersects = this.raycaster.intersectObject(this.plane);
        this.offset.copy(this.intersects[0].point).sub(this.plane.position);
    }
}

    DragObj.prototype.onDocumentMouseMove = function (e) {
        event.preventDefault();

        this.mouse = new THREE.Vector2();
        // Get mouse position
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera( this.mouse, this.camera );
        
        if (this.selection) {
            // Check the position where the plane is intersected
            this.intersects = this.raycaster.intersectObject(this.plane);
            // Reposition the object based on the intersection point with the plane
            this.selection.position.copy(this.intersects[0].point.sub(this.offset));
        } else {
            // Update position of the plane if need
            this.intersects = this.raycaster.intersectObject( this.object );

            if (this.intersects.length > 0) {
                this.plane.position.copy(this.intersects[0].object.position);
                this.plane.lookAt(this.camera.position);
            }
        }
    }

    DragObj.prototype.onDocumentMouseUp = function (e) {
        // Enable the controls
        this.controls.enabled = true;
        this.objectColorToggle.off();
        this.selection = null;
    }



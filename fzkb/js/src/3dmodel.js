var underwearObject; //内搭
var overcoatObject; //外套
var trouserObject; //裤装

var manager;

$(document).ready(function() {
	if(!Detector.webgl) Detector.addGetWebGLMessage();
	var container, stats, controls;
	var camera, scene, renderer, light;
	var clock = new THREE.Clock();
	var mixers = [];
	init();

	function init() {
		container = document.createElement('div');
		$("#modelContainer").append(container);
		camera = new THREE.PerspectiveCamera(45, window.innerWidth * 0.6 / window.innerHeight, 1, 2000);
		scene = new THREE.Scene();
		// grid
		var gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030);
		gridHelper.position.set(0, 0, 0);
		scene.add(gridHelper);
		// stats
		stats = new Stats();
		container.appendChild(stats.dom);

		// model
		manager = new THREE.LoadingManager();
		manager.onProgress = function(item, loaded, total) {
			console.log(item, loaded, total);
		};
		var onProgress = function(xhr) {
			if(xhr.lengthComputable) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log(Math.round(percentComplete, 2) + '% downloaded');
			}
		};
		var onError = function(xhr) {
			console.error(xhr);
		};

		var loader = new THREE.FBXLoader(manager);

		loader.load('models/fbx/body.fbx', function(object) {

			scene.add(object);
			
			//加载裤装模型
			loader.load('models/fbx/trousers.fbx', function(object) {
				trouserObject = object; //裤装
				scene.add(object);
			}, onProgress, onError);
			
			//加载内衣模型
			loader.load('models/fbx/underwear.fbx', function(object) {
				underwearObject = object;
				scene.add(object);
			}, onProgress, onError);
	
			//加载外套模型
			loader.load('models/fbx/greatcoat.fbx', function(object) {
				overcoatObject = object; //外套
				scene.add(object);
			}, onProgress, onError);

		}, onProgress, onError);

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth * 0.6, window.innerHeight - 100);
		container.appendChild(renderer.domElement);
		// controls, camera
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 12, 0);
		camera.position.set(2, 18, 28);
		controls.update();

		window.addEventListener('resize', onWindowResize, false);

		light = new THREE.HemisphereLight(0xffffff, 0x333333, 2.0);
		light.position.set(0, 1, 0);
		scene.add(light);

		light = new THREE.DirectionalLight(0xffffff, 1.0);
		light.position.set(0, 1, 0);
		scene.add(light);

		animate();
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth * 0.6 / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
	}
	//
	function animate() {
		requestAnimationFrame(animate);
		if(mixers.length > 0) {
			for(var i = 0; i < mixers.length; i++) {
				mixers[i].update(clock.getDelta());
			}
		}
		stats.update();
		render();
	}

	function render() {
		renderer.render(scene, camera);
	}
});
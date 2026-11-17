// Data 5 Halaman / Varietas Lily of the Valley
const flowerPages = {
    home: {
        badge: "GALERI BOTANI 3D",
        title: "Lily of the Valley",
        latin: "Convallaria majalis",
        desc: "Simbol kemurnian dan kebahagiaan. Nikmati visualisasi 3D kelopak putih bercahaya yang berpadu dengan partikel emas di atas latar biru malam.",
        aroma: "Manis & Segar",
        glow: "Putih Cahaya Murni",
        bellColor: 0xffffff,
        emissiveColor: 0xdbeafe,
        leafColor: 0x1e3a8a,
        bellScale: 1.0,
        bellCount: 6
    },
    majalis: {
        badge: "VARIETAS KLASIK EROPA",
        title: "Classic Majalis",
        latin: "Convallaria majalis var. typica",
        desc: "Varietas asli hutan Eropa dengan 6 hingga 12 kuntum lonceng putih bersih yang menggantung anggun pada satu tangkai melengkung.",
        aroma: "Kuat & Lembut",
        glow: "Putih Salju",
        bellColor: 0xffffff,
        emissiveColor: 0x93c5fd,
        leafColor: 0x1d4ed8,
        bellScale: 1.05,
        bellCount: 7
    },
    rosea: {
        badge: "VARIETAS LANGKA",
        title: "Pink Rosea",
        latin: "Convallaria majalis 'Rosea'",
        desc: "Mutasi alami yang memukau dengan semburat merah muda pucat lembut yang memantulkan cahaya biru muda dan kilau emas di bagian dalam kelopak.",
        aroma: "Lembut & Manis",
        glow: "Putih Mutiara Rose",
        bellColor: 0xfce7f3,
        emissiveColor: 0xf472b6,
        leafColor: 0x1e40af,
        bellScale: 1.0,
        bellCount: 6
    },
    albostriata: {
        badge: "VARIETAS DAUN EMAS",
        title: "Gold Albostriata",
        latin: "Convallaria majalis 'Albostriata'",
        desc: "Keistimewaan varietas ini terletak pada guratan garis emas bercahaya di sepanjang helai daunnya, berpadu dengan kelopak putih kristal.",
        aroma: "Segar & Floral",
        glow: "Putih & Aksen Emas",
        bellColor: 0xfffbeb,
        emissiveColor: 0xf59e0b,
        leafColor: 0xb45309, // Nuansa emas pada daun
        bellScale: 1.1,
        bellCount: 6
    },
    plena: {
        badge: "VARIETAS MAHKOTA GANDA",
        title: "Double Plena",
        latin: "Convallaria majalis 'Flore Pleno'",
        desc: "Memiliki lapisan kelopak ganda yang lebih rimbun menyerupai mawar mini berbentuk lonceng dengan pendar cahaya putih terang yang mewah.",
        aroma: "Sangat Harum",
        glow: "Putih Kristal Terang",
        bellColor: 0xffffff,
        emissiveColor: 0x60a5fa,
        leafColor: 0x172554,
        bellScale: 1.3,
        bellCount: 8
    }
};

const pageKeys = Object.keys(flowerPages);
let currentPageIndex = 0;
let isSpinning = true;

// Inisialisasi Scene, Camera, Renderer
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050b1a, 0.045);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 7.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// OrbitControls (Interaksi Mouse/Sentuh)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3.5;
controls.maxDistance = 13;

// Pencahayaan (Biru Muda, Emas, Putih Cahaya)
const ambientLight = new THREE.AmbientLight(0x60a5fa, 0.7);
scene.add(ambientLight);

const mainGlowLight = new THREE.PointLight(0xffffff, 1.8, 20);
mainGlowLight.position.set(2, 4, 4);
scene.add(mainGlowLight);

const goldRimLight = new THREE.PointLight(0xf59e0b, 2.2, 18);
goldRimLight.position.set(-4, 2, -2);
scene.add(goldRimLight);

const blueBottomLight = new THREE.PointLight(0x38bdf8, 1.5, 15);
blueBottomLight.position.set(0, -4, 3);
scene.add(blueBottomLight);

// Grup Utama Tanaman 3D
const plantGroup = new THREE.Group();
scene.add(plantGroup);

let bellMeshes = [];
let leafMeshes = [];

// Fungsi Membuat Geometri Lonceng Bunga (LatheGeometry)
function createBellGeometry() {
    const points = [];
    for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        // Kurva lonceng melebar di bawah dengan bibir melengkung keluar
        const radius = Math.sin(t * Math.PI * 0.65) * 0.38 + (t > 0.85 ? (t - 0.85) * 0.6 : 0);
        const y = -t * 0.65;
        points.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(points, 24);
}

// Fungsi Membangun Bunga Lily of the Valley 3D
function buildFlower(config) {
    // Bersihkan objek sebelumnya
    while (plantGroup.children.length > 0) {
        plantGroup.remove(plantGroup.children[0]);
    }
    bellMeshes = [];
    leafMeshes = [];

    // 1. Tangkai Melengkung (CatmullRomCurve3)
    const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -2.5, 0),
        new THREE.Vector3(-0.15, -0.5, 0.1),
        new THREE.Vector3(0.2, 1.2, 0.2),
        new THREE.Vector3(1.1, 2.2, 0.3)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.045, 8, false);
    const stemMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.3,
        roughness: 0.4
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    plantGroup.add(stemMesh);

    // 2. Daun Lebar Melengkung (2 helai)
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.7, 1.4, 0, 3.2);
    leafShape.quadraticCurveTo(-0.7, 1.4, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape, 16);
    const leafMat = new THREE.MeshStandardMaterial({
        color: config.leafColor,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.15,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.2
    });

    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(-0.1, -2.4, 0);
    leaf1.rotation.set(0.25, 0.3, 0.35);
    plantGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(0.1, -2.4, -0.1);
    leaf2.rotation.set(-0.2, -0.4, -0.3);
    leaf2.scale.set(0.85, 0.9, 0.85);
    plantGroup.add(leaf2);

    // 3. Kuntum Bunga Lonceng Bercahaya + Inti Emas
    const bellGeo = createBellGeometry();
    const bellMat = new THREE.MeshPhysicalMaterial({
        color: config.bellColor,
        emissive: config.emissiveColor,
        emissiveIntensity: 0.45,
        roughness: 0.15,
        transmission: 0.35,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
    });

    const coreGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Putik Emas

    for (let i = 0; i < config.bellCount; i++) {
        const t = 0.42 + (i / config.bellCount) * 0.55;
        const pointOnStem = stemCurve.getPoint(t);

        const bellGroup = new THREE.Group();
        bellGroup.position.copy(pointOnStem);
        bellGroup.position.y -= 0.15;
        bellGroup.position.x += 0.15;

        const bellMesh = new THREE.Mesh(bellGeo, bellMat);
        bellMesh.scale.setScalar(config.bellScale * (1 - i * 0.05));
        bellMesh.rotation.z = -0.25; // Menggantung miring alami

        const goldCore = new THREE.Mesh(coreGeo, coreMat);
        goldCore.position.y = -0.35;

        bellGroup.add(bellMesh);
        bellGroup.add(goldCore);
        plantGroup.add(bellGroup);
        bellMeshes.push(bellGroup);
    }
}

// 4. Partikel Cahaya Emas & Biru Muda Melayang
const particleCount = 180;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

const colorGold = new THREE.Color(0xf59e0b);
const colorLightBlue = new THREE.Color(0x60a5fa);
const colorWhite = new THREE.Color(0xffffff);

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 14;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;

    const chosenColor = i % 3 === 0 ? colorGold : (i % 3 === 1 ? colorLightBlue : colorWhite);
    particleColors[i * 3] = chosenColor.r;
    particleColors[i * 3 + 1] = chosenColor.g;
    particleColors[i * 3 + 2] = chosenColor.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Fungsi Navigasi Antar Halaman
function loadPage(pageKey) {
    const data = flowerPages[pageKey];
    if (!data) return;

    currentPageIndex = pageKeys.indexOf(pageKey);

    // Update Tombol Aktif
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageKey);
    });

    // Animasi Transisi Kartu
    const card = document.getElementById('info-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';

    setTimeout(() => {
        document.getElementById('page-badge').textContent = data.badge;
        document.getElementById('page-title').textContent = data.title;
        document.getElementById('page-latin').textContent = data.latin;
        document.getElementById('page-desc').textContent = data.desc;
        document.getElementById('page-specs').innerHTML = `
            <div class="spec-item">
                <span class="spec-label">Karakter Aroma</span>
                <span class="spec-value">${data.aroma}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Pendar Cahaya</span>
                <span class="spec-value">${data.glow}</span>
            </div>
        `;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 220);

    // Bangun ulang bunga 3D sesuai varietas
    buildFlower(data);
}

function nextPage() {
    const nextIndex = (currentPageIndex + 1) % pageKeys.length;
    loadPage(pageKeys[nextIndex]);
}

// Event Listener Tombol Navigasi
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        loadPage(button.dataset.page);
    });
});

document.getElementById('toggle-spin').addEventListener('click', function () {
    isSpinning = !isSpinning;
    this.textContent = isSpinning ? 'Jeda Rotasi' : 'Lanjutkan Rotasi';
});

// Loop Animasi 60 FPS
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotasi halus tanaman
    if (isSpinning) {
        plantGroup.rotation.y += 0.006;
    }

    // Animasi ayunan lembut pada tiap kelopak lonceng
    bellMeshes.forEach((bell, idx) => {
        bell.rotation.z = Math.sin(elapsedTime * 2 + idx) * 0.08;
        bell.rotation.x = Math.cos(elapsedTime * 1.5 + idx) * 0.05;
    });

    // Gerakan partikel emas & biru melayang naik
    particles.rotation.y = elapsedTime * 0.04;
    particles.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

    controls.update();
    renderer.render(scene, camera);
}

// Responsif saat ukuran layar berubah
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mulai dengan halaman pertama
loadPage('home');
animate();

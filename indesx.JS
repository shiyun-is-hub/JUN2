
        // 移动导航菜单功能
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
            
            // 点击导航链接后关闭菜单（移动端）
            const navItems = document.querySelectorAll('.nav-links a');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                });
            });
            
            // 增强版音乐播放器功能
        document.addEventListener('DOMContentLoaded', function() {
            const musicPlayer = document.getElementById('musicPlayer');
            const bgMusic = document.getElementById('bgMusic');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const musicInfo = document.getElementById('musicInfo');
            const debugInfo = document.getElementById('debugInfo');
            const debugToggle = document.getElementById('debugToggle');
            
            // 音乐列表
            const musicList = [
                {name: '0558_030c_545a_228b276b704ffdf2992ac0b49fb52bd3.m4a', path: '/JUN2/music/0558_030c_545a_228b276b704ffdf2992ac0b49fb52bd3.m4a'},
                {name: 'Distractions.m4a', path: '/JUN2/music/Distractions.m4a'},
                {name: 'Kauan.m4a', path: '/JUN2/music/Kauan.m4a'},
                {name: 'Sometimes.mp3', path: '/JUN2/music/Sometimes.mp3'},
                {name: 'Sudade.m4a', path: '/JUN2/music/Sudade.m4a'},
                {name: 'The wind, The Sea.m4a', path: '/JUN2/music/The wind, The Sea.m4a'},
                {name: 'This Place Is a Shelter.m4a', path: '/JUN2/music/This Place Is a Shelter.m4a'},
                {name: '克莱因之心.m4a', path: '/JUN2/music/克莱因之心.m4a'},
                {name: '燃.mp3', path: '/JUN2/music/燃.mp3'}
            ];
            
            // 备用路径（相对路径）
            const fallbackMusicList = musicList.map(song => {
                return {name: song.name, path: `music/${song.name}`};
            });
            
            let currentMusicIndex = 0;
            let isPlaying = false;
            let usingFallback = false;
            
            // 调试功能
            debugToggle.addEventListener('click', function() {
                debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
                updateDebugInfo();
            });
            
            function updateDebugInfo() {
                debugInfo.innerHTML = `
                    <div>当前音乐: ${musicList[currentMusicIndex].name}</div>
                    <div>使用备用路径: ${usingFallback ? '是' : '否'}</div>
                    <div>播放状态: ${isPlaying ? '播放中' : '暂停'}</div>
                    <div>音量: ${bgMusic.volume}</div>
                    <div>当前源: ${bgMusic.currentSrc || '无'}</div>
                `;
            }
            
            // 设置初始音量
            bgMusic.volume = volumeSlider.value;
            
            // 切换播放器展开/收起状态
            musicPlayer.addEventListener('click', function(e) {
                if (e.target === musicPlayer || e.target.classList.contains('music-icon')) {
                    musicPlayer.classList.toggle('expanded');
                }
            });
            
            // 播放/暂停功能
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (bgMusic.paused) {
                    // 尝试播放当前音乐
                    playCurrentMusic();
                } else {
                    bgMusic.pause();
                    isPlaying = false;
                    musicPlayer.classList.remove('playing');
                    playPauseBtn.textContent = '▶';
                    musicInfo.textContent = '已暂停';
                    updateDebugInfo();
                }
            });
            
            // 播放当前音乐函数
            function playCurrentMusic() {
                const music = usingFallback ? fallbackMusicList[currentMusicIndex] : musicList[currentMusicIndex];
                bgMusic.src = music.path;
                
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicPlayer.classList.add('playing');
                    playPauseBtn.textContent = '❚❚';
                    musicInfo.textContent = `播放中: ${music.name}`;
                    updateDebugInfo();
                }).catch(err => {
                    console.log('播放失败:', err);
                    
                    // 如果主路径失败，尝试备用路径
                    if (!usingFallback) {
                        usingFallback = true;
                        musicInfo.textContent = '尝试备用路径...';
                        playCurrentMusic();
                    } else {
                        musicInfo.textContent = '播放失败';
                        isPlaying = false;
                        updateDebugInfo();
                    }
                });
            }
            
            // 上一首功能
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
                loadMusic(currentMusicIndex);
                updateDebugInfo();
            });
            
            // 下一首功能
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
                loadMusic(currentMusicIndex);
                updateDebugInfo();
            });
            
            // 加载音乐函数
            function loadMusic(index) {
                const music = usingFallback ? fallbackMusicList[index] : musicList[index];
                bgMusic.src = music.path;
                musicInfo.textContent = `加载中: ${music.name}`;
                
                bgMusic.load();
                
                if (isPlaying) {
                    playCurrentMusic();
                }
                
                updateDebugInfo();
            }
            
            // 音量控制
            volumeSlider.addEventListener('input', function() {
                bgMusic.volume = this.value;
                updateDebugInfo();
            });
            
            // 音乐结束时自动播放下一首
            bgMusic.addEventListener('ended', function() {
                currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
                loadMusic(currentMusicIndex);
                updateDebugInfo();
            });
            
            // 错误处理
            bgMusic.addEventListener('error', function(e) {
                console.error('音频加载错误:', e);
                musicInfo.textContent = '加载错误，尝试下一首';
                
                // 尝试下一首
                setTimeout(() => {
                    currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
                    loadMusic(currentMusicIndex);
                }, 2000);
                
                updateDebugInfo();
            });
            
            // 检查用户是否已与页面交互过
            let userInteracted = false;
            
            document.addEventListener('click', function() {
                if (!userInteracted) {
                    userInteracted = true;
                    // 用户首次交互后允许音频播放
                    bgMusic.volume = volumeSlider.value;
                    updateDebugInfo();
                }
            });
            
            // 初始加载第一首音乐
            loadMusic(currentMusicIndex);
        });

        // 原有的导航菜单功能
        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
            
            // 点击导航链接后关闭菜单（移动端）
            const navItems = document.querySelectorAll('.nav-links a');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth <= 768) {
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                });
            });
        });

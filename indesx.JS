
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
            
            // 音乐播放器功能
            const musicPlayer = document.getElementById('musicPlayer');
            const bgMusic = document.getElementById('bgMusic');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            
            // 音乐列表（可以替换为您自己的音乐文件）
            const musicList = [
                'JUN2/0558_030c_545a_228b276b704ffdf2992ac0b49fb52bd3.m4a',
                'JUN2/Distractions.m4a',
                'JUN2/Kauan.m4a',
                'JUN2/Sometimes.mp3',
                'JUN2/Sudade.m4a',
                'JUN2/The wind, The Sea.m4a',
                'JUN2/This Place Is a Shelter.m4a',
                'JUN2/克莱因之心.m4a',
                'JUN2/燃.mp3',
            ];
            
            let currentMusicIndex = 0;
            let isPlaying = false;
            
            // 设置初始音量
            bgMusic.volume = volumeSlider.value;
            
            // 切换播放器展开/收起状态
            musicPlayer.addEventListener('click', function(e) {
                // 防止点击内部按钮时触发折叠
                if (e.target === musicPlayer || e.target.classList.contains('music-icon')) {
                    musicPlayer.classList.toggle('expanded');
                }
            });
            
            // 播放/暂停功能
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                if (bgMusic.paused) {
                    bgMusic.play().then(() => {
                        isPlaying = true;
                        musicPlayer.classList.add('playing');
                        playPauseBtn.textContent = '❚❚';
                    }).catch(err => {
                        console.log('播放失败:', err);
                    });
                } else {
                    bgMusic.pause();
                    isPlaying = false;
                    musicPlayer.classList.remove('playing');
                    playPauseBtn.textContent = '▶';
                }
            });
            
            // 上一首功能
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
                loadMusic(currentMusicIndex);
                if (isPlaying) {
                    bgMusic.play();
                }
            });
            
            // 下一首功能
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
                loadMusic(currentMusicIndex);
                if (isPlaying) {
                    bgMusic.play();
                }
            });
            
            // 音量控制
            volumeSlider.addEventListener('input', function() {
                bgMusic.volume = this.value;
            });
            
            // 加载音乐函数
            function loadMusic(index) {
                bgMusic.src = musicList[index];
                bgMusic.load();
            }
            
            // 音乐结束时自动播放下一首
            bgMusic.addEventListener('ended', function() {
                currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
                loadMusic(currentMusicIndex);
                if (isPlaying) {
                    bgMusic.play();
                }
            });
            
            // 检查用户是否已与页面交互过
            let userInteracted = false;
            
            document.addEventListener('click', function() {
                if (!userInteracted) {
                    userInteracted = true;
                    // 用户首次交互后允许音频播放
                    bgMusic.volume = volumeSlider.value;
                }
            });

        });

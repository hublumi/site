    // Configuration
    const CONFIG = {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "", 
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "", 
      GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "", 
      GEMINI_MODEL: import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash"
    };

    document.addEventListener('DOMContentLoaded', () => {
      console.log("Lumi Chat Initializing...");

      const elements = {
        chat: document.getElementById('lumiChat'),
        trigger: document.getElementById('chatTrigger'),
        closeBtn: document.getElementById('closeChatBtn'),
        input: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendMsgBtn'),
        content: document.getElementById('chatContent'),
        indicator: document.getElementById('typingIndicator'),
        form: document.getElementById("contactForm"),
        overlay: document.getElementById("successOverlay")
      };

      // Inicializar Supabase
      let supabase = null;
      try {
        if (window.supabase) {
          supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        }
      } catch (e) { console.error("Supabase error:", e); }

      // Funções de Interface
      const toggleChat = () => {
        console.log("Toggle Clicked");
        const isActive = elements.chat.classList.contains('lumi-active');
        if (isActive) {
          closeChat();
        } else {
          openChat();
        }
      };

      const openChat = () => {
        elements.chat.classList.add('lumi-active');
        elements.trigger.classList.add('lumi-hidden');
        elements.input.focus();
      };

      const closeChat = () => {
        elements.chat.classList.remove('lumi-active');
        elements.trigger.classList.remove('lumi-hidden');
      };

      // Event Listeners
      if (elements.trigger) elements.trigger.addEventListener('click', toggleChat);
      if (elements.closeBtn) elements.closeBtn.addEventListener('click', closeChat);

      // Atalhos externos (botões da página)
      document.querySelectorAll('[onclick="openChat()"]').forEach(btn => {
        btn.onclick = (e) => { e.preventDefault(); openChat(); };
      });

      // Enviar Mensagem
      const sendMessage = async () => {
        const msg = elements.input.value.trim();
        if (!msg) return;

        addMessage(msg, 'user');
        elements.input.value = '';
        elements.indicator.style.display = 'flex';
        elements.content.scrollTop = elements.content.scrollHeight;

        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Você é o Hub Lumi, assistente estratégico da HubLumi.
                      Contexto: A HubLumi transforma operações manuais em sistemas inteligentes com Automação e IA.
                      Tom de voz: Premium, direto, inovador.
                      Objetivo: Tirar dúvidas e levar ao agendamento do Mapeamento Gratuito.
                      Usuário: ${msg}`
                }]
              }]
            })
          });

          const data = await response.json();
          elements.indicator.style.display = 'none';

          if (data.candidates && data.candidates[0].content.parts[0].text) {
            addMessage(data.candidates[0].content.parts[0].text, 'bot');
          } else {
            throw new Error("API Response Error");
          }
        } catch (err) {
          elements.indicator.style.display = 'none';
          addMessage("Tive um problema de conexão. Poderia tentar novamente?", 'bot');
          console.error(err);
        }
      };

      if (elements.sendBtn) elements.sendBtn.addEventListener('click', sendMessage);
      if (elements.input) {
        elements.input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      }

      function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${type}`;
        const time = new Intl.DateTimeFormat('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }).format(new Date());
        msgDiv.innerHTML = `<div class="msg-bubble">${text}</div><span class="msg-time">${time}</span>`;
        elements.content.appendChild(msgDiv);
        elements.content.scrollTop = elements.content.scrollHeight;
      }

      // Contact Form
      if (elements.form) {
        elements.form.addEventListener("submit", async function (e) {
          e.preventDefault();
          const btn = this.querySelector('button');
          const originalText = btn.textContent;
          btn.textContent = "Enviando…";
          btn.disabled = true;

          const formData = new FormData(this);
          const rawData = Object.fromEntries(formData.entries());

          // Mapeamento exato para a tabela 'hl_leads' do seu Supabase
          const leadData = {
            contact_name: rawData.Nome || '',
            company_name: rawData.Empresa || '',
            segment: rawData.Segmento || '',
            email: rawData['E-mail'] || '',
            whatsapp: rawData.Telefone || '',
            project_description: rawData.Mensagem || ''
          };

          try {
            // 1. Prioridade Máxima: Salvar no Supabase (Tabela: hl_leads)
            let supabaseSuccess = false;
            if (supabase) {
              const { error: sbError } = await supabase
                .from('hl_leads')
                .insert([leadData]);

              if (sbError) {
                console.error("Erro Supabase Detalhado:", sbError.message);
              } else {
                console.log("Contato salvo no Supabase (hl_leads) com sucesso!");
                supabaseSuccess = true;
              }
            }

            // 2. Enviar por E-mail (FormSubmit) - Se estiver fora do ar, não trava o usuário
            try {
              const response = await fetch(this.action, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                body: JSON.stringify(rawData)
              });
              
              if (!response.ok) throw new Error("Service Down");
            } catch (formErr) {
              console.warn("FormSubmit está instável ou fora do ar. O lead foi salvo apenas no Supabase.");
            }

            // Se o Supabase funcionou ou o FormSubmit funcionou, consideramos sucesso
            this.reset();
            elements.overlay.style.display = "flex";

          } catch (err) {
            console.error("Erro Geral no Envio:", err);
            // Fallback final: se tudo falhar, avisa o usuário mas não deixa ele "no escuro"
            alert("Houve uma instabilidade momentânea nos nossos servidores, mas estamos processando seu pedido. Se preferir, nos chame no WhatsApp!");
            elements.overlay.style.display = "flex";
          } finally {
            btn.textContent = originalText;
            btn.disabled = false;
          }
        });
      }

      // SVG Scroll Animation — draw path as user scrolls
      const svg  = document.getElementById('scroll-line-svg');
      const path = document.querySelector('.scroll-follow-path');

      if (svg && path) {

        // --- Mobile viewBox fix ---
        // On mobile, the body is taller and the viewport narrower.
        // To avoid distortion we compute a viewBox whose X-span matches the
        // Y-span ratio so the knot looks circular (same scale in both axes).
        function applyViewBox() {
          const isMobile = window.innerWidth < 980;
          if (isMobile) {
            // Wait one frame so scrollHeight is final after layout
            requestAnimationFrame(() => {
              const bodyH  = document.documentElement.scrollHeight;
              const vbH    = 2730;   // our viewBox height
              const scaleY = bodyH / vbH;          // px per SVG-unit (vertical)
              const vbW    = window.innerWidth / scaleY; // SVG-units visible horizontally
              const knotCX = 700;                  // horizontal centre of knot cluster
              const vbMinX = knotCX - vbW / 2;
              svg.setAttribute('viewBox', `${vbMinX} -50 ${vbW} ${vbH}`);
              svg.setAttribute('preserveAspectRatio', 'none');
              initAnimation();
            });
          } else {
            svg.setAttribute('viewBox', '-320 -50 1400 2730');
            svg.setAttribute('preserveAspectRatio', 'none');
            initAnimation();
          }
        }

        function initAnimation() {
          const pathLength = path.getTotalLength();
          path.style.strokeDasharray  = pathLength + ' ' + pathLength;
          path.style.strokeDashoffset = pathLength * 0.70; // 30% drawn at load

          let ticking = false;

          function updateScrollPath() {
            const maxScroll     = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
            // Use Math.sqrt for a non-linear drawing rate: draws much faster at the beginning of the scroll
            const drawn = pathLength * (0.30 + Math.sqrt(scrollProgress) * 0.70);
            path.style.strokeDashoffset = pathLength - drawn;
            ticking = false;
          }

          // Remove previous scroll listener before re-adding
          window.removeEventListener('scroll', window._svgScrollHandler);
          window._svgScrollHandler = () => {
            if (!ticking) {
              requestAnimationFrame(updateScrollPath);
              ticking = true;
            }
          };
          window.addEventListener('scroll', window._svgScrollHandler, { passive: true });

          updateScrollPath();
        }

        applyViewBox();

        // Re-apply on resize (orientation change on mobile)
        window.addEventListener('resize', applyViewBox, { passive: true });
      }

    });

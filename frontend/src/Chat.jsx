import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 안녕하세요! 저는 골든서울호텔의 AI 컨시어지 ‘한결’입니다.

이 데모 챗봇은 실제 투숙객처럼 자연스럽게 질문할 수 있으며,  
호텔 관리자님께는 시스템 도입 시 어떻게 작동하는지 시뮬레이션 해드립니다.

🌐 대화 가능한 언어:
- 한국어 (안녕하세요!)
- 中文 (您好，我会说中文。)
- 日本語 (こんにちは、日本語でも大丈夫です。)
- English (This system supports all English dialects freely.)

궁금한 내용을 편하게 물어보세요 😊`
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (customMessage) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', text: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:4000/chat', {
        message: messageToSend
      });
      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'bot', text: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'bot', text: '⚠️ 죄송합니다. 문제가 발생했습니다. 다시 시도해주세요.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white p-6">
      <div
        className="max-w-2xl mx-auto rounded-2xl shadow-lg p-6 border border-yellow-600 backdrop-blur-sm"
        style={{
          backgroundImage: "url('/golden-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(248,244,227,0.85)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-[#1A1A2E] drop-shadow-lg">
  🏨 골든서울호텔 온라인 프론트
</h2>


        <div className="space-y-3 mb-4 max-h-[450px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap drop-shadow-sm
                  ${msg.role === 'user'
                    ? 'bg-[#D4AF37] text-black rounded-br-none'
                    : 'bg-[#F8F4E3] text-black rounded-bl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
  <div className="text-sm text-[#1A1A2E] italic">응답 중입니다...</div>
)}

          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isComposing) sendMessage();
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-black"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400"
          >
            {loading ? '...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  );
}

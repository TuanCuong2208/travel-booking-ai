import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { TOURS } from '@/data/mockTours';

// Bản đồ liên kết các vùng du lịch lân cận của Việt Nam
const NEARBY_REGIONS: Record<string, string[]> = {
  'Quy Nhơn': ['Phú Yên', 'Nha Trang', 'Đà Nẵng', 'Hội An'],
  'Phú Yên': ['Quy Nhơn', 'Nha Trang', 'Đà Lạt'],
  'Nha Trang': ['Phú Yên', 'Đà Lạt', 'Phan Thiết', 'Quy Nhơn'],
  'Đà Nẵng': ['Hội An', 'Huế', 'Quy Nhơn'],
  'Hội An': ['Đà Nẵng', 'Huế', 'Quy Nhơn'],
  'Huế': ['Đà Nẵng', 'Hội An', 'Quảng Bình'],
  'Đà Lạt': ['Nha Trang', 'Buôn Ma Thuột', 'Phan Thiết'],
  'Hà Giang': ['Cao Bằng', 'Sa Pa', 'Hà Nội'],
  'Sa Pa': ['Hà Giang', 'Mộc Châu', 'Hà Nội'],
  'Hà Nội': ['Hạ Long', 'Ninh Bình', 'Sa Pa', 'Mộc Châu'],
  'Hạ Long': ['Hà Nội', 'Ninh Bình', 'Cát Bà'],
  'Ninh Bình': ['Hà Nội', 'Hạ Long'],
  'Phú Quốc': ['Cần Thơ', 'Vũng Tàu', 'TP.HCM'],
  'Cần Thơ': ['Phú Quốc', 'Vũng Tàu'],
  'Vũng Tàu': ['Tây Ninh', 'Cần Thơ', 'Phú Quốc'],
  'Buôn Ma Thuột': ['Đà Lạt', 'Pleiku', 'Nha Trang'],
};

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const userMsg = (message || '').trim();
    const query = userMsg.toLowerCase();

    // 1. NẾU CÓ KEY GEMINI THÌ GỌI MODEL AI
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_o_day') {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const tourContext = JSON.stringify(
          TOURS.map((t) => ({ id: t.id, title: t.title, destination: t.destination, price: t.price, duration: t.duration }))
        );
        const chatContext = (history || []).map((h: any) => `${h.sender === 'user' ? 'Khách' : 'Bot'}: ${h.text}`).join('\n');

        const prompt = `
Bạn là Trợ lý AI du lịch VietVenture. 
Dữ liệu tour hiện có:
${tourContext}

Lịch sử trò chuyện:
${chatContext}

Tin nhắn mới của khách: "${userMsg}"

Yêu cầu:
- Trả lời tự nhiên, hiểu câu hỏi tiếp nối (ví dụ "gần đó", "chỗ nào khác", "rẻ hơn").
- Nếu gợi ý được tour cụ thể, ở cuối câu hãy gắn mã: [TOUR_ID: mã_tour].
- Trả lời ngắn gọn từ 2-3 câu.
`;
        const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const text = res.text || '';
        const match = text.match(/\[TOUR_ID:\s*([a-zA-Z0-9_-]+)\]/);
        const tour = match ? TOURS.find((t) => t.id === match[1]) : null;

        return NextResponse.json({
          success: true,
          reply: text.replace(/\[TOUR_ID:\s*([a-zA-Z0-9_-]+)\]/, '').trim(),
          suggestedTour: tour,
        });
      } catch (err) {
        console.warn('Gemini fallback to Smart Local Engine:', err);
      }
    }

    // 2. BỘ XỬ LÝ NGỮ NGHĨA LIÊN KẾT ĐỊA PHƯƠNG (SMART LOCAL ENGINE)

    // Tìm xem trong lịch sử gần nhất vừa nhắc đến địa phương nào
    let lastMentionedDestination = '';
    const recentHistory = [...(history || [])].reverse();
    for (const h of recentHistory) {
      const match = TOURS.find((t) => h.text.toLowerCase().includes(t.destination.toLowerCase()));
      if (match) {
        lastMentionedDestination = match.destination;
        break;
      }
    }

    let matchedTour = null;
    let botReply = '';

    // Trường hợp 1: Hỏi về địa điểm lân cận ("gần đó", "quanh đây", "tiện đường")
    const isAskingNearby = query.includes('gần') || query.includes('lân cận') || query.includes('xung quanh') || query.includes('tiện đường');

    if (isAskingNearby && lastMentionedDestination) {
      const nearbyList = NEARBY_REGIONS[lastMentionedDestination] || ['Đà Nẵng', 'Phú Yên', 'Nha Trang'];
      const targetDest = nearbyList[0]; // Lấy địa phương lân cận đầu tiên
      matchedTour = TOURS.find((t) => t.destination.toLowerCase() === targetDest.toLowerCase()) || null;

      botReply = `Gần ${lastMentionedDestination} nhất thì có **${nearbyList.slice(0, 3).join(', ')}** bạn nhé! Nổi bật nhất là tour đi **${targetDest}** (${matchedTour?.duration}) chỉ **${matchedTour?.price.toLocaleString('vi-VN')} đ/khách**, bạn có thể kết hợp đi chung một chuyến rất tiện đường. Thẻ tour chi tiết mình gửi ngay bên dưới:`;
    }
    // Trường hợp 2: Khách nhập trực tiếp tên địa phương mới
    else {
      matchedTour = TOURS.find((t) =>
        query.includes(t.destination.toLowerCase()) ||
        t.destination.toLowerCase().includes(query)
      );

      if (matchedTour) {
        botReply = `Dạ tour ${matchedTour.destination} bên mình đang có chương trình **${matchedTour.title}** (${matchedTour.duration}) trọn gói chỉ **${matchedTour.price.toLocaleString('vi-VN')} đ/khách**! Mình gửi thẻ tour kèm lịch trình chi tiết ngay bên dưới để bạn tham khảo nhé:`;
      } else if (query.includes('rẻ') || query.includes('tiết kiệm') || query.includes('kinh tế')) {
        matchedTour = [...TOURS].sort((a, b) => a.price - b.price)[0];
        botReply = `Tour có mức giá tiết kiệm nhất hiện nay là **${matchedTour.title}** tại ${matchedTour.destination} với chi phí chỉ **${matchedTour.price.toLocaleString('vi-VN')} đ/khách** trọn gói ${matchedTour.duration} ạ!`;
      } else {
        // Nếu không khớp từ nào, kiểm tra tiếp nối câu trước
        if (lastMentionedDestination) {
          matchedTour = TOURS.find((t) => t.destination === lastMentionedDestination);
          botReply = `Về hành trình tại ${lastMentionedDestination}, bên mình có đầy đủ dịch vụ xe đưa đón, khách sạn 3-4 sao và hướng dẫn viên suốt tuyến. Bạn có thể bấm nút "Lịch trình" hoặc "Đặt ngay" ở thẻ dưới nhé!`;
        } else {
          botReply = `Dạ chào bạn! VietVenture có hơn 100 tour du lịch trải dài khắp Bắc - Trung - Nam như **Hà Giang**, **Sa Pa**, **Đà Nẵng**, **Huế**, **Quy Nhơn**, **Phú Yên**, **Phú Quốc**... Bạn đang có kế hoạch đi biển đảo, săn mây hay khám phá ẩm thực ở đâu để mình tư vấn tour tối ưu nhất ạ?`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      reply: botReply,
      suggestedTour: matchedTour,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, reply: 'Hệ thống đang bận một chút, bạn thử lại sau nhé!' }, { status: 500 });
  }
}
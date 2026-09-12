import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { TOURS } from '@/data/mockTours';

export async function POST(req: Request) {
  try {
    const { destination, days, budget, preferences } = await req.json();
    const destName = (destination || '').trim();
    const daysNum = Math.min(Math.max(Number(days) || 3, 1), 7);

    // 1. NẾU CÓ KEY GEMINI THÌ TỰ ĐỘNG GỌI LLM SINH LỊCH TRÌNH
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_o_day') {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `
Bạn là chuyên gia du lịch hàng đầu tại Việt Nam. Lên lịch trình du lịch cá nhân hóa cho:
- Địa điểm: ${destName}
- Số ngày: ${daysNum} ngày
- Ngân sách: ${budget ? Number(budget).toLocaleString('vi-VN') + ' đ' : 'Tiết kiệm'}
- Sở thích: ${preferences || 'Khám phá, ẩm thực'}

YÊU CẦU: Trả về JSON THUẦN (không bọc trong \`\`\`json, không chú thích thêm ngoài JSON):
{
  "title": "Tên chuyến đi cuốn hút",
  "estimatedBudget": "Ước tính chi phí",
  "days": [
    {
      "day": 1,
      "summary": "Tóm tắt điểm nhấn ngày 1",
      "activities": [
        { "time": "Sáng (07:30 - 11:30)", "action": "Tên điểm tham quan cụ thể và hoạt động" },
        { "time": "Trưa (12:00 - 13:30)", "action": "Món đặc sản trưa và quán gợi ý" },
        { "time": "Chiều (14:30 - 17:30)", "action": "Điểm check-in chụp ảnh buổi chiều" },
        { "time": "Tối (18:30 - 21:30)", "action": "Trải nghiệm dạo phố, ngắm cảnh hoặc ẩm thực đêm" }
      ]
    }
  ]
}
`;
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const raw = res.text || '';
        const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json({ success: true, plan: parsed });
      } catch (e) {
        console.warn('Gemini fallback to local generator:', e);
      }
    }

    // 2. BỘ PHÁT SINH LỊCH TRÌNH CỤ THỂ THEO DỮ LIỆU ĐỊA PHƯƠNG THỰC TẾ
    // Tìm trong kho 100 tour xem có điểm đến tương ứng không
    const matchingTour = TOURS.find((t) =>
      t.destination.toLowerCase().includes(destName.toLowerCase()) ||
      destName.toLowerCase().includes(t.destination.toLowerCase())
    );

    // Dữ liệu fallback dự phòng cho các địa điểm nổi tiếng
    const LOCAL_KNOWLEDGE: Record<string, { spots: string[]; foods: string[] }> = {
      'quy nhơn': {
        spots: ['Bãi biển Kỳ Co', 'Eo Gió ngắm sóng vỗ', 'Khu dã ngoại Trung Lương', 'Tháp Đôi', 'Ghềnh Ráng Tiên Sa viếng mộ Hàn Mặc Tử', 'Đồi cát Phương Mai'],
        foods: ['Bánh xèo tôm nhảy rau mầm', 'Bún chả cá Quy Nhơn', 'Bánh hỏi lòng heo', 'Hải sản đường Xuân Diệu', 'Cơm gà Quy Nhơn'],
      },
      'đà lạt': {
        spots: ['Đồi chè Cầu Đất săn mây', 'Thác Datanla trượt máng', 'Ga Đà Lạt cổ kính', 'Quảng trường Lâm Viên', 'Làng Cù Lần', 'Hồ Tuyền Lâm'],
        foods: ['Lẩu gà lá é Tao Ngộ', 'Bánh tráng nướng chợ đêm', 'Lẩu bò Ba Toa', 'Kem bơ Thanh Thảo', 'Bánh căn xíu mại'],
      },
      'phú quốc': {
        spots: ['Cano 4 đảo Hòn Gầm Ghì', 'Cáp treo Hòn Thơm', 'Bãi Sao cát trắng', 'Sunset Town Thị trấn hoàng hôn', 'Grand World thành phố không ngủ'],
        foods: ['Gỏi cá trích cuốn bánh tráng', 'Bún quậy Kiến Xây', 'Còi biên mai nướng sate', 'Hải sản Hàm Ninh'],
      },
      'sa pa': {
        spots: ['Đỉnh Fansipan nóc nhà Đông Dương', 'Bản Cát Cát của người H’Mông', 'Cổng trời Ô Quy Hồ', 'Thung lũng Mường Hoa', 'Nhà thờ đá Sa Pa'],
        foods: ['Lẩu cá hồi cá tầm Sa Pa', 'Thịt lợn cắp nách nướng than hoa', 'Cơm lam gà nướng ống nứa', 'Thịt trâu gác bếp chấm chẩm chéo'],
      },
      'đà nẵng': {
        spots: ['Cầu Vàng Bà Nà Hills', 'Bán đảo Sơn Trà chùa Linh Ứng', 'Bãi biển Mỹ Khê', 'Cầu Rồng phun lửa nước', 'Ngũ Hành Sơn động Huyền Không'],
        foods: ['Mì Quảng ếch bếp Trang', 'Bánh tráng cuốn thịt heo Trần', 'Bún chả cá Nguyễn Chí Thanh', 'Chè sầu Liên'],
      },
      'hà giang': {
        spots: ['Đèo Mã Pí Lèng', 'Du thuyền hẻm Tu Sản sông Nho Quế', 'Cột cờ Lũng Cú', 'Dinh họ Vương (Vua Mèo)', 'Phố cổ Đồng Văn'],
        foods: ['Thắng dền nóng hổi', 'Cháo ấu tẩu giải cảm', 'Bánh tam giác mạch chiên', 'Phở tráng kìm'],
      },
    };

    const key = Object.keys(LOCAL_KNOWLEDGE).find((k) => destName.toLowerCase().includes(k)) || 'quy nhơn';
    const loc = matchingTour
      ? {
          spots: matchingTour.itinerary.map((i) => i.title.replace(/Ngày \d+: /, '')),
          foods: ['Đặc sản ẩm thực truyền thống địa phương', 'Hải sản tươi sống vùng biển', 'Món ăn vặt chợ đêm'],
        }
      : LOCAL_KNOWLEDGE[key];

    const generatedDays = Array.from({ length: daysNum }, (_, i) => {
      const s1 = loc.spots[i % loc.spots.length] || `Khu danh thắng nổi bật ${i + 1}`;
      const s2 = loc.spots[(i + 1) % loc.spots.length] || `Điểm check-in hoàng hôn`;
      const food = loc.foods[i % loc.foods.length] || 'Đặc sản trứ danh';

      return {
        day: i + 1,
        summary: `Khám phá ${s1} & thưởng thức ${food}`,
        activities: [
          {
            time: 'Sáng (07:30 - 11:30)',
            action: `Ăn sáng nạp năng lượng, sau đó khởi hành tham quan ${s1}. Tận hưởng không khí trong lành và chụp ảnh check-in.`,
          },
          {
            time: 'Trưa (12:00 - 13:30)',
            action: `Dùng bữa trưa tại nhà hàng địa phương, thưởng thức món: "${food}". Nghỉ ngơi ngắn lấy lại sức.`,
          },
          {
            time: 'Chiều (14:30 - 17:30)',
            action: `Di chuyển sang ${s2}. Trải nghiệm hoạt động văn hóa, ngắm cảnh hoàng hôn chiều buông.`,
          },
          {
            time: 'Tối (18:30 - 21:30)',
            action: `Dạo phố đêm trung tâm, thưởng thức ẩm thực đường phố, mua sắm quà lưu niệm đặc sản.`,
          },
        ],
      };
    });

    const smartPlan = {
      title: `Lịch Trình Độc Quyền Khám Phá ${destName || 'Việt Nam'} (${daysNum}N${daysNum - 1}Đ)`,
      estimatedBudget: `${budget ? Number(budget).toLocaleString('vi-VN') : '3.500.000'} đ/khách`,
      days: generatedDays,
    };

    return NextResponse.json({ success: true, plan: smartPlan });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
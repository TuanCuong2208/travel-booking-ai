import { Tour } from '../types/travel';

// Danh sách các vùng trọng điểm và điểm đến đặc trưng khắp Việt Nam
const DESTINATIONS_CATALOG = [
  // MIỀN BẮC
  {
    name: 'Hà Nội',
    type: 'Văn hóa & Ẩm thực',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60',
    spots: ['Hồ Hoàn Kiếm', 'Văn Miếu Quốc Tử Giám', 'Chùa Một Cột', 'Phố Cổ 36 Phố Phường', 'Lăng Bác', 'Cầu Long Biên'],
    foods: ['Phở bò Bát Đàn', 'Bún chả Hương Liên', 'Cà phê trứng Giảng', 'Chả cá Lã Vọng'],
  },
  {
    name: 'Sa Pa',
    type: 'Săn mây & Vùng cao',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=60',
    spots: ['Đỉnh Fansipan 3.143m', 'Bản Cát Cát', 'Thung lũng Mường Hoa', 'Cổng Trời Ô Quy Hồ', 'Thác Bạc'],
    foods: ['Lẩu cá tầm', 'Thịt lợn cắp nách nướng', 'Thắng cố bản địa', 'Cơm lam nướng ống tre'],
  },
  {
    name: 'Hạ Long',
    type: 'Kỳ quan biển đảo',
    img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=60',
    spots: ['Vịnh Hạ Long', 'Đảo Ti Tốp', 'Hang Sửng Sốt', 'Làng chài Cửa Vạn', 'Vịnh Lan Hạ'],
    foods: ['Chả mực giã tay', 'Sá sùng xào tỏi', 'Bún bề bề', 'Hàu nướng mỡ hành'],
  },
  {
    name: 'Hà Giang',
    type: 'Phượt đèo & Trekking',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    spots: ['Đèo Mã Pí Lèng', 'Sông Nho Quế', 'Hẻm Tu Sản', 'Dinh thự Vua Mèo', 'Cột cờ Lũng Cú', 'Rừng thông Yên Minh'],
    foods: ['Bánh tam giác mạch', 'Cháo ấu tẩu', 'Thắng dền Đồng Văn', 'Thịt trâu gác bếp'],
  },
  {
    name: 'Ninh Bình',
    type: 'Di sản danh thắng',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    spots: ['Quần thể Tràng An', 'Hang Múa', 'Chùa Bái Đính', 'Cố đô Hoa Lư', 'Tam Cốc Bích Động'],
    foods: ['Cơm cháy chà bông', 'Dê núi Ninh Bình', 'Nem chua Yên Mạc', 'Rượu Kim Sơn'],
  },
  {
    name: 'Mộc Châu',
    type: 'Sinh thái & Nông nghiệp',
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
    spots: ['Đồi chè Trái Tim', 'Thung lũng mận Nà Ka', 'Thác Dải Yếm', 'Cầu kính Bạch Long'],
    foods: ['Bê chao Mộc Châu', 'Sữa tươi thanh trùng', 'Cá suối nướng', 'Rau cải mèo'],
  },
  {
    name: 'Cao Bằng',
    type: 'Thiên nhiên hùng vĩ',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    spots: ['Thác Bản Giốc', 'Động Ngườm Ngao', 'Suối Lê-nin', 'Đèo Mã Phục'],
    foods: ['Vịt quay 7 vị', 'Bánh cuốn canh Cao Bằng', 'Hạt dẻ Trùng Khánh'],
  },

  // MIỀN TRUNG & TÂY NGUYÊN
  {
    name: 'Quy Nhơn',
    type: 'Biển hoang sơ & Khám phá',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    spots: ['Eo Gió', 'Bãi Kỳ Co', 'Khu dã ngoại Trung Lương', 'Tháp Bánh Ít', 'Ghềnh Ráng Tiên Sa'],
    foods: ['Bánh xèo tôm nhảy', 'Bún chả cá Quy Nhơn', 'Bánh hỏi cháo lòng', 'Cua Huỳnh Đế'],
  },
  {
    name: 'Đà Nẵng',
    type: 'Thành phố đáng sống',
    img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop&q=60',
    spots: ['Cầu Vàng Bà Nà Hills', 'Bán đảo Sơn Trà', 'Biển Mỹ Khê', 'Cầu Rồng phun lửa', 'Ngũ Hành Sơn'],
    foods: ['Mì Quảng ếch', 'Bánh tráng cuốn thịt heo hai đầu da', 'Bún mắm nêm', 'Gỏi cá Nam Ô'],
  },
  {
    name: 'Hội An',
    type: 'Di sản cổ kính',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60',
    spots: ['Chùa Cầu Nhật Bản', 'Phố đèn lồng ven sông Hoài', 'Rừng dừa Bảy Mẫu', 'Làng gốm Thanh Hà'],
    foods: ['Cao lầu Hội An', 'Cơm gà Bà Buội', 'Bánh mì Phượng', 'Nước mót thảo mộc'],
  },
  {
    name: 'Huế',
    type: 'Di sản cố đô',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60',
    spots: ['Đại Nội Kinh Thành Huế', 'Chùa Thiên Mụ', 'Lăng Khải Định', 'Lăng Tự Đức', 'Sông Hương ca Huế'],
    foods: ['Bún bò giò heo Huế', 'Bánh bèo nậm lọc', 'Cơm hến cồn Hến', 'Chè bột lọc heo quay'],
  },
  {
    name: 'Đà Lạt',
    type: 'Sương mù & Lãng mạn',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    spots: ['Đồi chè Cầu Đất săn mây', 'Thác Datanla máng trượt', 'Hồ Tuyền Lâm', 'Chợ Đêm Đà Lạt', 'Quảng trường Lâm Viên'],
    foods: ['Lẩu gà lá é Tao Ngộ', 'Bánh tráng nướng chợ đêm', 'Lẩu bò Ba Toa', 'Kem bơ Thanh Thảo'],
  },
  {
    name: 'Nha Trang',
    type: 'Thiên đường biển xanh',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    spots: ['VinWonders Hòn Tre', 'Viện Hải dương học', 'Tháp Bà Ponagar', 'Tour 4 đảo vịnh Nha Trang'],
    foods: ['Bún sứa Nha Trang', 'Nem nướng Ninh Hòa', 'Bánh căn mực trứng', 'Hải sản bờ kè'],
  },
  {
    name: 'Phú Yên',
    type: 'Xứ sở hoa vàng cỏ xanh',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    spots: ['Gành Đá Đĩa', 'Bãi Xép - Gành Ông', 'Mũi Điện cực Đông', 'Tháp Nghinh Phong', 'Đầm Ô Loan'],
    foods: ['Mắt cá ngừ đại dương hầm thuốc bắc', 'Sò huyết đầm Ô Loan', 'Bánh canh hẹ'],
  },
  {
    name: 'Buôn Ma Thuột',
    type: 'Thủ phủ Cà phê & Thác nước',
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
    spots: ['Cụm thác Dray Nur & Dray Sap', 'Bảo tàng Thế giới Cà phê', 'Hồ Lắk', 'Bản Đôn'],
    foods: ['Bún chìa Đắk Lắk', 'Gà nướng cơm lam Bản Đôn', 'Cà phê nguyên chất Chư Sê'],
  },

  // MIỀN NAM & BIỂN ĐẢO
  {
    name: 'Phú Quốc',
    type: 'Nghỉ dưỡng 5 sao & Lặn biển',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=60',
    spots: ['Grand World đảo ngọc', 'Cáp treo Hòn Thơm vượt biển', 'Bãi Sao biển xanh cát trắng', 'Công viên san hô Hòn Gầm Ghì'],
    foods: ['Gỏi cá trích Phú Quốc', 'Bún quậy Kiến Xây', 'Còi biên mai nướng muối ớt', 'Hải sản chợ đêm'],
  },
  {
    name: 'Côn Đảo',
    type: 'Tâm linh & Biển nguyên sơ',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    spots: ['Nghĩa trang Hàng Dương viếng Cô Sáu', 'Hệ thống Nhà tù Côn Đảo', 'Bãi Đầm Trầu ngắm máy bay', 'Vườn quốc gia Côn Đảo'],
    foods: ['Ốc vú nàng hấp sả', 'Mứt hạt bàng Côn Đảo', 'Cá thu một nắng', 'Cháo hàu nóng'],
  },
  {
    name: 'Cần Thơ',
    type: 'Sông nước Miền Tây',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=60',
    spots: ['Chợ nổi Cái Răng', 'Bến Ninh Kiều', 'Nhà cổ Bình Thủy', 'Vườn trái cây Phong Điền'],
    foods: ['Lẩu mắm Dạ Lý', 'Bánh cống Cần Thơ', 'Vịt nấu chao', 'Nem nướng Cái Răng'],
  },
  {
    name: 'Tây Ninh',
    type: 'Tâm linh & Chinh phục đỉnh cao',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    spots: ['Đỉnh Núi Bà Đen nóc nhà Nam Bộ', 'Tòa Thánh Tây Ninh', 'Hồ Dầu Tiếng'],
    foods: ['Bánh tráng phơi sương cuốn thịt luộc', 'Bò tơ Tây Ninh', 'Muối tôm Tây Ninh'],
  },
  {
    name: 'Vũng Tàu',
    type: 'Biển thư giãn cuối tuần',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    spots: ['Bãi Trước & Bãi Sau', 'Ngọn hải đăng Vũng Tàu', 'Tượng Chúa Kito Vua', 'Mũi Nghinh Phong'],
    foods: ['Bánh khọt Gốc Vú Sữa', 'Lẩu cá đuối Trương Công Định', 'Bông lan trứng muối'],
  },
];

// Biến tấu 5 gói tour cho mỗi địa phương -> Tạo thành hơn 100 Tour phong phú
const THEMES = [
  { nameSuffix: 'Trọn Gói Tiết Kiệm', duration: '2N1Đ', multiplier: 0.65, prefix: 'Khám Phá Nhanh' },
  { nameSuffix: 'Hành Trình Khám Phá Toàn Diện', duration: '3N2Đ', multiplier: 1.0, prefix: 'Du Lịch' },
  { nameSuffix: 'Nghỉ Dưỡng Cao Cấp & Trải Nghiệm', duration: '4N3Đ', multiplier: 1.45, prefix: 'Kỳ Nghỉ Thượng Lưu' },
  { nameSuffix: 'Săn Ảnh Sống Ảo & Ẩm Thực', duration: '3N2Đ', multiplier: 1.1, prefix: 'Food Tour & Check-in' },
  { nameSuffix: 'Trekking & Khám Phá Văn Hóa Bản Địa', duration: '4N3Đ', multiplier: 1.35, prefix: 'Chinh Phục' },
];

export const TOURS: Tour[] = [];

let counter = 1;
DESTINATIONS_CATALOG.forEach((dest) => {
  THEMES.forEach((theme) => {
    const basePrice = Math.floor((2200000 + (counter % 7) * 450000) * theme.multiplier);
    const id = `tour_${counter}`;
    
    // Tự sinh lịch trình chi tiết tương ứng với từng ngày của tour
    const daysCount = parseInt(theme.duration.slice(0, 1)) || 3;
    const itinerary = Array.from({ length: daysCount }, (_, d) => {
      const spot1 = dest.spots[d % dest.spots.length];
      const spot2 = dest.spots[(d + 1) % dest.spots.length];
      const food = dest.foods[d % dest.foods.length];
      return {
        day: d + 1,
        title: `Ngày ${d + 1}: ${spot1} - Khám phá ${spot2}`,
        detail: `Buổi sáng tham quan và check-in tại ${spot1}. Trưa dùng bữa đặc sản ${food}. Chiều di chuyển tới ${spot2}, chụp ảnh ngắm cảnh và dạo phố về đêm.`,
      };
    });

    TOURS.push({
      id,
      title: `${theme.prefix} ${dest.name} - ${theme.nameSuffix}`,
      destination: dest.name,
      price: Math.round(basePrice / 10000) * 10000,
      duration: theme.duration,
      rating: +(4.6 + (counter % 5) * 0.1).toFixed(1),
      featured: counter % 4 === 0,
      image: dest.img,
      description: `Tour ${theme.nameSuffix.toLowerCase()} tại ${dest.name} với các điểm đến nổi tiếng như ${dest.spots.slice(0, 3).join(', ')}. Thưởng thức đặc sản ${dest.foods.slice(0, 2).join(', ')}.`,
      itinerary,
    });

    counter++;
  });
});
import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p><strong>상호 :</strong> 선민엠엔에스 | <strong>대표 :</strong> 유정열</p>
          <p><strong>주소 :</strong> (12902) 경기도 하남시 미사강변한강로 165 현대 클래스트 한강미사3차 A.A721</p>
          <p><strong>사업자등록번호 :</strong> 219-08-67256 | <strong>통신판매업신고 :</strong> 송파 제 34325호</p>
          <p><strong>고객센터 :</strong> 02-422-6999 | <strong>FAX :</strong> 070-7469-8466</p>
          <p><strong>Email :</strong> sunmin@sunmin.co.kr | <strong>주문문의 :</strong> order@sunmin.co.kr</p>

          {/* 푸터 링크 */}
          <div className="footer-links">
            <a href="/about">회사소개</a>
            <a href="/terms">이용약관</a>
            <a href="/privacy">개인정보취급방침</a>
            <a href="/contact">오시는길</a>
          </div>
        </div>
      </div>

      <div className="copyright">
        COPYRIGHT ⓒ 2025 <span className="gold">SUNMIN M&S</span>. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}

export default Footer;

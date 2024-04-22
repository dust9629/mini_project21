async function updateUserInfo(req, res) {
  const userId = req.params.userId;
  const {
    currentPassword,
    newPassword,
    confirmNewPassword,
    nickname,
    profile,
  } = req.body;

  // 요청한 사용자 ID와 인증된 사용자 ID 비교
  if (req.user.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: "자신의 정보만 수정할 수 있습니다.",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    // 비밀번호 변경 로직
    if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          message: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        });
      }

      if (currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "현재 비밀번호가 정확하지 않습니다.",
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
      }
    }

    // 기타 정보 업데이트
    if (nickname) user.nickname = nickname;
    if (profile) user.profile = profile;

    await user.save();

    res.status(200).json({
      success: true,
      message: "회원 정보가 성공적으로 수정되었습니다.",
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        profile: user.profile,
        user_role: user.user_role,
        social_login_provider: user.social_login_provider,
        social_login_id: user.social_login_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "서버 오류: 회원 정보 수정에 실패했습니다.",
      error: error.message,
    });
  }
}
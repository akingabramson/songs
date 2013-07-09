class User < ActiveRecord::Base
  attr_accessible :name, :password, :password_confirmation
  has_secure_password

  has_many :songs

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    return self.session_token
  end
end

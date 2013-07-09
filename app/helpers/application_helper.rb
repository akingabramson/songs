module ApplicationHelper
  def require_login
    unless logged_in?
      flash[:error] = "Sorry, you have to be logged in to do that!"
      redirect_to new_session_url
    end
  end

  def logged_in?
    !!current_user
  end

  def current_user
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def store_location
    session[:return_to] = request.request_uri
  end

  def redirect_back_or_default(default = root_url)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end
end

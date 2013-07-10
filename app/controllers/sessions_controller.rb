class SessionsController < ApplicationController
  def new
    p session[:session_token]
    @user = User.new
  end

  def create
    @user = User.find_by_name(params[:name])
    if @user.try(:authenticate, params[:password])
      session[:session_token] = @user.reset_session_token!
      redirect_back_or_default
    else
      flash[:error] = "Invalid username or password."
      @user = User.new({name: params[:name]})
      render :new
    end
  end


  def destroy
    if logged_in?
      current_user.reset_session_token!
      session[:session_token] = nil
      redirect_to root_url
    else
      redirect_back_or_default
    end
  end

end

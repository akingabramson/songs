class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      session[:session_token] = @user.reset_session_token!
      redirect_back_or_default
    else
      flash[:error] = @user.errors.full_messages
      render :new
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end
end
